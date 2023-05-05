import StorageManager from "helpers/StorageManager";
import { useCallback, useEffect, useState} from "react";
import GameModel from "models/Game";
import { api } from "helpers/api";
import Poll from "models/Poll";
import { joinCall } from "helpers/agora";

let periodicFunctionToBeCalled = () => {};

const periodicFunctionCaller = () => {
  periodicFunctionToBeCalled();
}

//needed for the second game call after 2 seconds
let stageContainer = "";

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
    return (currentPoll && currentPoll.role !== newPoll.role);
  }

  const stageDidChange = (newGame) => {
    return (game && (newGame.stage.type !== stageContainer));
  }

  const performStageChange = (newGame) => {
    if (newGame.stage.type === "Day"){
      joinCall();
    }
  }

  const fetchPoll = async () => {
    try{
      const response = await api.get(`/games/${lobbyId}/polls`);
      let newPoll = new Poll(response.data);
      newPoll.printPoll();
      if(pollDidChange(newPoll)) {
        await fetchGame();
        if(!finished) {
          //recall this function again because with high server demand it might happen that the game isn't updated a the
          //time of the first game fetch
          setTimeout(fetchGame, 2000);
        }
      }
      setCurrentPoll(newPoll)
      if(!isPollActive(newPoll)) {
        await fetchGame();
      }
    } catch (error) {
      console.error("Details Fetch Poll Error: ", error);
    }
  };

  const fetchGame = async () => {
    try{
      const response = await api.get(`/games/${lobbyId}`);
      let newGame = new GameModel(response.data);
      if(stageDidChange(newGame)) {
        performStageChange(newGame);
      }
      setGame(newGame);
      stageContainer = newGame.stage.type;
      if(response.data.finished) {
        console.log("The game has ended, calling fetchEndData now");
        await fetchEndData();
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
      }, 15000);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lobbyId, token]);

  periodicFunctionToBeCalled = fetchPoll;
  return {game, finished, started, currentPoll, endData, pollActive};
};