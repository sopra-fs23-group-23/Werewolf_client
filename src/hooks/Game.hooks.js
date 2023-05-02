import StorageManager from "helpers/StorageManager";
import { useCallback, useEffect, useState} from "react";
import LobbyModel from "models/Lobby";
import Player from "models/Player";
import { api } from "helpers/api";
import Poll from "models/Poll";

export const useGame = () => {
    const lobbyId = StorageManager.getLobbyId();
    const token = StorageManager.getUserToken();
    const [started, setStarted] = useState(false);
    const [stage, setStage] = useState("");
    const [lobby, setLobby] = useState(null);
    const [admin, setAdmin] = useState(false);
    const [finished, setFinished] = useState(false);
    const [currentPoll, setCurrentPoll] = useState(null);
    const [endData, setEndData] = useState(null);
    const [intervalFetchPoll, setIntervalFetchPoll] = useState(null);
    const [intervalFetchGame, setIntervalFetchGame] = useState(null);


    const updateDataToLobby = useCallback((data) => {
      const lobby = new LobbyModel(data);
      setLobby(lobby);
    }, []);

    const fetchGame = useCallback(async () => {
      try{
        const response = await api.get(`/games/${lobbyId}`);
        updateDataToLobby(response.data.lobby);
        setStage(response.data.stage.type);
        setAdmin(new Player(response.data.lobby.admin));
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
        //console.log("Response: ", response.data);
        let newPoll = new Poll(response.data);
        //newPoll.setVoteArray(response.data.pollOptions);
        //newPoll.setOwnVote(response.data.pollOptions, StorageManager.getUserId());
        
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

    return {started, admin, stage, lobby, currentPoll, finished, endData, intervalFetchGame, intervalFetchPoll};
}