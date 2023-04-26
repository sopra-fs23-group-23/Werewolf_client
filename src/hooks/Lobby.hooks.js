import { useEffect, useState, useCallback } from "react";
import { api } from "helpers/api";
import LobbyModel from "models/Lobby";
import StorageManager from "helpers/StorageManager";
import { startBasicCall } from "helpers/agora";
import { createEventSource } from "helpers/createEventSource";
import { useHistory } from "react-router-dom";

export const useLobby = () => {
  const lobbyId = StorageManager.getLobbyId();
  const uid = StorageManager.getUserId();
  const [lobby, setLobby] = useState(null);
  const history = useHistory();
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
      await updateDataToLobby(response.data);
    } catch (error) {
      console.error("Details:", error);
      alert(
        "Something went wrong while fetching the lobby! See the console for details."
      );
    }
  }, [lobbyId]);

  const fetchChannelToken = useCallback(async () => {
    try {
      const response = await api.get(`agora/${lobbyId}/token`);
      StorageManager.setChannelToken(response.data);
    } catch (error) {
      console.error("Details: ", error);
      alert(
        "Something went wrong while fetching the channeltoken! See the console for details."
      );
    }
  }, [lobbyId]);

  useEffect(() => {
    async function fetchData() {
      await fetchLobby();
      //await fetchChannelToken();
      //startBasicCall();
    }
    fetchData().then();
    setIntervalId(setInterval(fetchLobby, 3000));
  }, [
    lobbyId
  ]);

  return { lobby, uid, intervalId};
};