import { useEffect, useState, useCallback } from "react";
import { api } from "helpers/api";
import LobbyModel from "models/Lobby";
import StorageManager from "helpers/StorageManager";
import { startBasicCall } from "helpers/agora";

export const useLobby = () => {
  const lobbyId = StorageManager.getLobbyId();
  const uid = StorageManager.getUserId();
  const [lobby, setLobby] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  const updateDataToLobby = useCallback((data) => {
    console.log("updateDataToLobby", data)
    const lobby = new LobbyModel(data);
    setLobby(lobby);
  }, []);

  const fetchLobby = useCallback(async () => {
    try {
      const response = await api.get(`/lobbies/${lobbyId}`);
      console.log(response)
      updateDataToLobby(response.data);
    } catch (error) {
      console.error("Details:", error);
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
      await fetchLobby();
      await fetchChannelToken();
      startBasicCall();
    }
    fetchData().then();
    const intervalId = setInterval(fetchLobby, 1000);
    setIntervalId(intervalId);
    return () => clearInterval(intervalId);
  },
  // eslint-disable-next-line
  [lobbyId]);

  return { lobby, uid, intervalId};
};