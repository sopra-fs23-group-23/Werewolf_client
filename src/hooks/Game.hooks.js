import StorageManager from "helpers/StorageManager";
import { createEventSource } from "helpers/createEventSource";
import { useCallback, useEffect, useState} from "react";

export const useGame = () => {
    const lobbyId = StorageManager.getLobbyId();
    const token = StorageManager.getUserToken();
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [data, setData] = useState(null);

    const subscribeToEmitter = useCallback((lobbyId, token) =>{
        const eventSource = createEventSource(`games/${lobbyId}/sse/${token}`);
        eventSource.addEventListener("start", (event) => {
            setStarted(true);
        });
        eventSource.addEventListener("stage", (event)=>{
            console.log("Stage started.", event.data);
        });
        eventSource.addEventListener("finish", (event)=>{
          setStarted(false);
          setFinished(true);
          setData(JSON.parse(event.data));
          console.log("Game ended.", event.data);
        });
    }, [setStarted, setFinished]);


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

    return {started, finished, data};
}