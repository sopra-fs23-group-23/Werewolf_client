import { useEffect, useState, useCallback } from "react";
import { api } from "helpers/api";
import LobbyModel from "models/Lobby";
import StorageManager from "helpers/StorageManager";
import { joinCall } from "helpers/agora";

export const useLobby = () => {
  const lobbyId = StorageManager.getLobbyId();
  const uid = StorageManager.getUserId();
  const [lobby, setLobby] = useState(null);
  const [error, setError] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  const fetchLobby = useCallback(async () => {
    try {
      const response = await api.get(`/lobbies/${lobbyId}`);
      console.log(response)
      setLobby(new LobbyModel(response.data));
    } catch (error) {
      console.error("Details:", error);
      setError(error);
    }
  },
    // eslint-disable-next-line
    [lobbyId]);

  const fetchChannelToken = useCallback(async () => {
    try {
      const response = await api.get(`agora/${lobbyId}/token`);
      StorageManager.setChannelToken(response.data);
    } catch (error) {
      console.error("Details: ", error);
    }
  }, [lobbyId]);

  useEffect(() => {
    async function fetchData() {
      //await fetchLobby();
      //await fetchChannelToken();
      //await joinCall();
    }
    fetchData().then();
    const intervalId = setInterval(fetchLobby, 1000);
    setIntervalId(intervalId);
    return () => clearInterval(intervalId);
  },
  // eslint-disable-next-line
  [lobbyId]);

  return { lobby, error, uid, intervalId};
};