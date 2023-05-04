import StorageManager from "helpers/StorageManager";
import { useCallback, useEffect, useState} from "react";
import GameModel from "models/Game";
import { api } from "helpers/api";
import Poll from "models/Poll";

let inceptionFunction = () => {};

const inception = () => {
  inceptionFunction();
}

export const useGame = () => {
    const lobbyId = StorageManager.getLobbyId();
    const token = StorageManager.getUserToken();
    const [started, setStarted] = useState(false);
    const [game, setGame] = useState(null);
    const [finished, setFinished] = useState(false);    // is also part of game, but this state is only set to true when endData is already fetched
    const [endData, setEndData] = useState(null);
    const [currentPoll, setCurrentPoll] = useState(null);
    const [intervalFetchPoll, setIntervalFetchPoll] = useState(null);

  const pollDidChange = (newPoll) => {
    return !!(currentPoll && currentPoll.role !== newPoll.role);
  }
  const fetchPoll = async () => {
    try{
      const response = await api.get(`/games/${lobbyId}/polls`);
      let newPoll = new Poll(response.data);
      newPoll.printPoll();
      if(pollDidChange(newPoll)) {
        await fetchGame();
      }
      setCurrentPoll(newPoll)
    } catch (error) {
      console.error("Details Fetch Poll Error: ", error);
    }
  };

    const fetchGame = useCallback(async () => {
      console.log("_______________________________");
      try{
        const response = await api.get(`/games/${lobbyId}`);
        setGame(new GameModel(response.data));
        console.log("Game");
        console.log(response);
        if(response.data.finished) {
          console.log("The game has ended, calling fetchEndData now");
          await fetchEndData();
        }
      } catch (error) {
        console.error(error);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lobbyId]);

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
    }, [lobbyId]);

    useEffect(() => {
      setTimeout(async () => {
        await fetchGame();
        await fetchPoll();
        setStarted(true);
        inceptionFunction = fetchPoll;
        const pollIntervalId = setInterval(inception, 1000);
        setIntervalFetchPoll(pollIntervalId);
        return () => {
          clearInterval(pollIntervalId);
        };
      }, 4000);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lobbyId, token]);

  inceptionFunction = fetchPoll;
  return {game, finished, started, currentPoll, endData};
}