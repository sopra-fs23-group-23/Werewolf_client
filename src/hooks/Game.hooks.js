import StorageManager from "helpers/StorageManager";
import { useCallback, useEffect, useState} from "react";
import GameModel from "models/Game";
import { api } from "helpers/api";
import Poll from "models/Poll";
import Log from "../models/Log";
import { useHistory } from 'react-router-dom';
import {toggleOwnVideo, joinCall, leaveCall, tryVideoEnable, toggleAudio} from 'helpers/agora';

let periodicFunctionToBeCalled = () => {};
let logger = new Log();
let gameShouldBeFetchedAgain = false;
let intervalKeeper = null;

const periodicFunctionCaller = () => {
  periodicFunctionToBeCalled();
}

export const useGame = () => {
  const lobbyId = StorageManager.getLobbyId();
  const token = StorageManager.getUserToken();
  const [started, setStarted] = useState(false);
  const [game, setGame] = useState(null);
  const [finished, setFinished] = useState(false);    // is also part of game, but this state is only set to true when endData is already fetched
  const [endData, setEndData] = useState(null);
  const [currentPoll, setCurrentPoll] = useState(null);
  const [pollActive, setPollActive] = useState(false);
  const history = useHistory();

  const isPollActive = (newPoll) => {
    if (newPoll) {
      const now = new Date();
      const timeLeft = Math.ceil((newPoll.scheduledFinish - now) / 1000);
      if (timeLeft <= 0) {
        if (pollActive) {
          setPollActive(false);
        }
        return false;
      } else {
        if (!pollActive) {
          setPollActive(true);
        }
        return true;
      }
    }
  }

  const pollDidChange = (newPoll) => {
    return (currentPoll && currentPoll.id !== newPoll.id);
  }

  const stageDidChange = (newGame) => {
    return (game && (newGame.stage.type !== game.stage.type));
  }

  const safeJoinCall = async () => {
    await joinCall();
    if(StorageManager.getIsVideoEnabled() === "false") {
      await toggleOwnVideo();
    }
    if(StorageManager.getIsMuted() === "true") {
      await toggleAudio();
    }
  }

  const performStageChange = async (newGame) => {
    if (newGame.stage.type === "Day"){
      try {
        await safeJoinCall();
      } catch (e) {
        console.log(e);
      }
    }
  }

  const gameFetchCheck = (newGame) => {
    //if the game didn't change through the check stop the action performed on a gameStateChange and instead fetch again
    //one second late
    if(!game) {
      gameShouldBeFetchedAgain = false;
    } else {
      gameShouldBeFetchedAgain = (newGame.pollCount === game.pollCount);
    }
    return !gameShouldBeFetchedAgain;
  }

  const fetchPoll = async () => {
    try{
      const response = await api.get(`/games/${lobbyId}/polls`);
      let newPoll = new Poll(response.data);
      newPoll.printPoll();
      if(pollDidChange(newPoll) || gameShouldBeFetchedAgain || !isPollActive(newPoll)) {
        await fetchGame();
        try {
          if (newPoll.role === "Werewolf" && newPoll.isVoteParticipant && pollDidChange(newPoll)) {
            await safeJoinCall();
          }
        } catch (e) {
          console.log(e);
        }
      }
      setCurrentPoll(newPoll);
    } catch (error) {
      console.error("Details Fetch Poll Error: ", error);
    }
  };

  const fetchGame = async () => {
    try{
      const response = await api.get(`/games/${lobbyId}`);
      if(response.data.finished) {
        console.log("The game has ended, calling fetchEndData now");
        await logger.addActions(response.data.actions);
        await fetchEndData();
      } else {
        let newGame = new GameModel(response.data);
        console.log(newGame);
        if(gameFetchCheck(newGame)) {
          if(stageDidChange(newGame)) {
            performStageChange(newGame);
          }
          await logger.addActions(response.data.actions);
          setGame(newGame);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEndData = useCallback(async () => {
    try {
      const response = await api.get(`/games/${lobbyId}/winner`);
      setEndData(response.data);
      console.log("Game ended: ", response.data);
      setStarted(false);
      setFinished(true);
      clearInterval(intervalKeeper);
    } catch (error) {
      console.error("Details Fetch End Data Error: ", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lobbyId]);

  // checks if the game is already running so that the information screen is not shown after reload
  const showInfoScreen = async () => {
    try{
      await api.get(`/games/${lobbyId}`);
      return false; // game has already started --> don't show info screen
    } catch (error) {
      if(error.response.status === 404) {
        alert("There exists no game with this lobby ID.");
        leaveCall();
        StorageManager.removeChannelToken();
        history.push("/home");
        return "redirect";
      }
      if(error.response.status === 403) { // maybe use some other indicator than 403 for unstarted game?
        return true; // game has not yet started --> show info screen
      }
      console.error(error);
    }
  };

    useEffect(() => {
      async function init() {
        intervalKeeper = null;
        let timeoutDuration = 0;
        const showInfoScreenOrLeave = await showInfoScreen();
        logger = new Log();
        if(showInfoScreenOrLeave !== "redirect") {  // when the game doesn't exist anymore after reload --> don't set interval
          if(showInfoScreenOrLeave === true) {
            timeoutDuration = 16000;
          }
          setTimeout(async () => {
            await fetchGame();
            await fetchPoll();
            setStarted(true);
            await tryVideoEnable();
            periodicFunctionToBeCalled = fetchPoll;
            intervalKeeper = setInterval(periodicFunctionCaller, 1000);
          }, timeoutDuration);
        }
      }
      init();
      return () => {
        if(intervalKeeper) {
          setStarted(false);
          clearInterval(intervalKeeper);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lobbyId, token]);

  periodicFunctionToBeCalled = fetchPoll;
  return {game, finished, started, currentPoll, endData, pollActive, logger};
};