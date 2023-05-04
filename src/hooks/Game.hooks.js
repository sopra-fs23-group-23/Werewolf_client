import StorageManager from "helpers/StorageManager";
import { useCallback, useEffect, useState} from "react";
import GameModel from "models/Game";
import { api } from "helpers/api";
import Poll from "models/Poll";

export const useGame = () => {
    const lobbyId = StorageManager.getLobbyId();
    const token = StorageManager.getUserToken();
    const [started, setStarted] = useState(false);
    const [game, setGame] = useState(null);
    const [finished, setFinished] = useState(false);    // is also part of game, but this state is only set to true when endData is already fetched
    const [currentPoll, setCurrentPoll] = useState(null);
    const [endData, setEndData] = useState(null);
    const [intervalFetchPoll, setIntervalFetchPoll] = useState(null);
    const [intervalFetchGame, setIntervalFetchGame] = useState(null);

    const fetchGame = useCallback(async () => {
      try{
        const response = await api.get(`/games/${lobbyId}`);
        setGame(new GameModel(response.data));
        if(response.data.finished) {
          console.log("The game has ended, calling fetchEndData now");
          fetchEndData();
        }
      } catch (error) {
        console.error(error);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lobbyId]);

    const fetchPoll = useCallback(async () => {
      try{
        const response = await api.get(`/games/${lobbyId}/polls`);
        let newPoll = new Poll(response.data);
        newPoll.printPoll();
        setCurrentPoll(newPoll);
      } catch (error) {
        console.error("Details Fetch Poll Error: ", error);
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
      } catch (error) {
        console.error("Details Fetch End Data Error: ", error); 
      }
    }, [lobbyId]);

    useEffect(() => {
      setTimeout(async () => {
          await fetchGame();
          await fetchPoll();
          setStarted(true);

          const pollIntervalId = setInterval(fetchPoll, 1000);
          setIntervalFetchPoll(pollIntervalId);
          const gameIntervalId = setInterval(fetchGame, 1000);
          setIntervalFetchGame(gameIntervalId);
        return () => {
          clearInterval(pollIntervalId);
          clearInterval(gameIntervalId);
        };
      }, 4000);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lobbyId, token]);

    return {game, finished, started, currentPoll, endData, intervalFetchGame, intervalFetchPoll};
}