import StorageManager from "helpers/StorageManager";
import { createEventSource } from "helpers/createEventSource";
import { useCallback, useEffect, useState} from "react";
import LobbyModel from "models/Lobby";
import Player from "models/Player";

export const useGame = () => {
    const lobbyId = StorageManager.getLobbyId();
    const token = StorageManager.getUserToken();
    const [started, setStarted] = useState(false);
    const [stage, setStage] = useState("");
    const [lobby, setLobby] = useState(null);
    const [admin, setAdmin] = useState(false);
    const [voteMap, setVoteMap] = useState(new Map());
    const [voteParticipants, setVoteParticipants] = useState([]);
    const [ownVote, setOwnVote] = useState(null);
    const [scheduledFinish, setScheduledFinish] = useState(null);
    const [votingParty, setVotingParty] = useState([]);
    const [finished, setFinished] = useState(false);
    const [endData, setData] = useState(null);
    const [question, setQuestion] = useState(null);


    const updateDataToLobby = useCallback((data) => {
      console.log("updateDataToGame", data.lobby)
      const lobby = new LobbyModel(data.lobby);
      setLobby(lobby);

    }, []);

    const updateOwnVote = useCallback((data) => {
      setOwnVote(null);
      data.pollOptions.forEach(option => {
        option.supporters.forEach(supporter => {
          if (parseInt(supporter.id) === parseInt(StorageManager.getUserId())) {
            setOwnVote(option.player);
          }
        })
      })
    }, []);

    const updateVoteMap = useCallback((data) => {
      const newVoteMap = new Map();
      const sortedPollOptions = data.pollOptions.sort((a, b) => {
        return b.supporters.length - a.supporters.length;
      });
      sortedPollOptions.forEach(option => {
        let supporterArray = [];
        option.supporters.forEach(supporter => {
          supporterArray.push(supporter.id)
        })
        if (supporterArray.length > 0) {
          newVoteMap.set(new Player(option.player), supporterArray)
        }

      });
      setVoteMap(newVoteMap);
    }, []);

    const updateVoteParticipants = useCallback((data) => {
      let voteParticipants = [];
      data.participants.forEach(participant => {
        voteParticipants.push(participant)
      })
      setVoteParticipants(voteParticipants);
    }, []);

    const subscribeToEmitter = useCallback((lobbyId, token) =>{
        const eventSource = createEventSource(`games/${lobbyId}/sse/${token}`);
        eventSource.addEventListener("start", (event) => {
            setStarted(true);
        });

        eventSource.addEventListener("stage", (event)=>{
          console.log("Stage started:", event.data);
          const dataJSON = JSON.parse(event.data);
          updateDataToLobby(dataJSON);
          setStage(dataJSON.stage.type);
          setAdmin(new Player(dataJSON.admin));
        })

        eventSource.addEventListener("poll", (event)=>{
          console.log("Poll started:", event.data);
          const dataJSON = JSON.parse(event.data);
          updateVoteMap(dataJSON);
          updateVoteParticipants(dataJSON);
          updateOwnVote(dataJSON);
          setScheduledFinish(new Date(dataJSON.scheduledFinish));
          setQuestion(dataJSON.question);
          //compareStrings
          if (dataJSON.question == "Who do you suspect to be a werewolf?"){ 
            setVotingParty("Villagers");
          } else {
            setVotingParty("Werewolves");
          }
          console.log("scheduledFinish: ", new Date(scheduledFinish));
        })

        eventSource.addEventListener("finish", (event)=>{
          setStarted(false);
          setFinished(true);
          setData(JSON.parse(event.data));
          console.log("Game ended:", event.data);
        });

    }, []);

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

    return {started, stage, lobby, admin, voteMap, votingParty, question, voteParticipants, scheduledFinish, finished, endData, ownVote};
}