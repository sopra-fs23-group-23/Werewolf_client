import StorageManager from "helpers/StorageManager";
import { useCallback, useEffect, useState} from "react";
import LobbyModel from "models/Lobby";
import Player from "models/Player";
import { api } from "helpers/api";

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
    //const [hitlist, setHitlist] = useState([]);
    const [votingParty, setVotingParty] = useState([]);
    const [finished, setFinished] = useState(false);
    const [endData, setEndData] = useState(null);
    const [question, setQuestion] = useState(null);

    const [intervalFetchPoll, setIntervalFetchPoll] = useState(null);
    const [intervalFetchGame, setIntervalFetchGame] = useState(null);

    const updateDataToLobby = useCallback((data) => {
      const lobby = new LobbyModel(data);
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
      //data = MockPollOptions;
      const newVoteMap = new Map();
      //console.log("updateVoteMap in Game XXX", data)
      const sortedPollOptions = data.pollOptions.sort((a, b) => {
        return b.supporters.length - a.supporters.length;
      });
      sortedPollOptions.forEach(option => {
        let supporterArray = [];
        option.supporters.forEach(supporter => {
          supporterArray.push(supporter.id)
        })
        //console.log("VoteMap SET: ", new Player(option.player), supporterArray)
        if (supporterArray.length > 0) {
          newVoteMap.set(new Player(option.player), supporterArray)
        }

      });
      //console.log("VoteMap final: ", newVoteMap)
      setVoteMap(newVoteMap);
    }, []);

    const updateVoteParticipants = useCallback((data) => {
      let voteParticipants = [];
      data.participants.forEach(participant => {
        voteParticipants.push(participant)
      })
      setVoteParticipants(voteParticipants);
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
      // eslint-disable-next-line no-use-before-define
    }, [lobbyId, updateDataToLobby, fetchEndData]);

    const fetchPoll = useCallback(async () => {
      try{
        const response = await api.get(`/games/${lobbyId}/polls`);

        // maybe call these functions outside of try catch block to properly catch errors
        updateVoteMap(response.data);
        updateVoteParticipants(response.data);
        updateOwnVote(response.data);
        setScheduledFinish(new Date(response.data.scheduledFinish));
        if (response.data.participants.length > 0) {
          setQuestion(response.data.question);
        } else {
          setQuestion("You are not part of the current vote");
        }
        setVotingParty(response.data.role);
      } catch (error) {
        console.error("Details Fetch Poll Error: ", error);
      }
    }, [lobbyId, updateOwnVote, updateVoteMap, updateVoteParticipants,]);

    // only gets called once when game is finished

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
      setTimeout(() => {
        async function fetchData() {
          await fetchGame();
          await fetchPoll();
          setStarted(true);

          setIntervalFetchPoll(setInterval(fetchPoll, 1000));
          setIntervalFetchGame(setInterval(fetchGame, 1000));
        }
        fetchData().then();
      }, 15000);
    }, [lobbyId, token, fetchGame, fetchPoll]);

    return {started, stage, lobby, admin, voteMap, votingParty, question, voteParticipants, scheduledFinish, finished, endData, ownVote, intervalFetchGame, intervalFetchPoll};
}