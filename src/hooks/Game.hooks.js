import StorageManager from "helpers/StorageManager";
import { useCallback, useEffect, useState} from "react";
import GameModel from "models/Game";
import { api } from "helpers/api";
import Poll from "models/Poll";
import Log from "../models/Log";
import { joinCall } from "helpers/agora";

let periodicFunctionToBeCalled = () => {};

const periodicFunctionCaller = () => {
  periodicFunctionToBeCalled();
}

const logger = new Log();

let gameShouldBeFetchedAgain = false;

export const useGame = () => {
  const lobbyId = StorageManager.getLobbyId();
  const token = StorageManager.getUserToken();
  const [started, setStarted] = useState(false);
  const [game, setGame] = useState(null);
  const [finished, setFinished] = useState(false);    // is also part of game, but this state is only set to true when endData is already fetched
  const [endData, setEndData] = useState(null);
  const [currentPoll, setCurrentPoll] = useState(null);
  const [pollActive, setPollActive] = useState(false);
  const [intervalFetchPoll, setIntervalFetchPoll] = useState(null);

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

  const performStageChange = (newGame) => {
    if (newGame.stage.type === "Day"){
      joinCall();
      StorageManager.setIsMuted(false);
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
      clearInterval(intervalFetchPoll);
    } catch (error) {
      console.error("Details Fetch End Data Error: ", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lobbyId, game]);

    useEffect(() => {
      setTimeout(async () => {
        await fetchGame();
        await fetchPoll();
        setStarted(true);
        periodicFunctionToBeCalled = fetchPoll;
        const pollIntervalId = setInterval(periodicFunctionCaller, 1000);
        setIntervalFetchPoll(pollIntervalId);
        return () => {
          clearInterval(pollIntervalId);
        };
      }, 16000);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lobbyId, token]);

  periodicFunctionToBeCalled = fetchPoll;
  return {game, finished, started, currentPoll, endData, pollActive, logger};
};