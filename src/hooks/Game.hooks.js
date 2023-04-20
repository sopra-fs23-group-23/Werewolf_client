import StorageManager from "helpers/StorageManager";
import { createEventSource } from "helpers/createEventSource";
import { useCallback, useEffect, useState} from "react";
import LobbyModel from "models/Lobby";

export const useGame = () => {
    const lobbyId = StorageManager.getLobbyId();
    const token = StorageManager.getUserToken();
    const [started, setStarted] = useState(false);
    const [stage, setStage] = useState(0);
    const [lobby, setLobby] = useState(null);
    const [votes, setVotes] = useState([]);
    const [admin, setAdmin] = useState(false);

    const updateGameData = useCallback((data) => {
      console.log("updateGameData", data)
      const lobby = new LobbyModel(data);
      setLobby(lobby);
    }, []);

    const subscribeToEmitter = useCallback((lobbyId, token) =>{
        const eventSource = createEventSource(`games/${lobbyId}/sse/${token}`);
        eventSource.addEventListener("start", (event) => {
            setStarted(true);
        });
        eventSource.addEventListener("stage", (event)=>{
          //console.log("Stage started.", event.data);
          console.log("Game event.data", event.data);
          updateGameData(JSON.parse(event.data));
          console.log("Lobby in Game Hook", lobby);

        })
    }, [setStarted]);


    useEffect(() => {
        function fetchData() {
          subscribeToEmitter(lobbyId, token);
        }
        fetchData();
      }, [
        lobbyId,
        token,
        subscribeToEmitter,
      ]);

    return {started, lobby};
}