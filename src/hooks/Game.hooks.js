import StorageManager from "helpers/StorageManager";
import { createEventSource } from "helpers/createEventSource";
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
    const [endData, setData] = useState(null);
    const [question, setQuestion] = useState(null);

    const [game, setGame] = useState(null);
    const [poll, setPoll] = useState(null);

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
        setGame(response.data);
        updateDataToLobby(response.data.lobby);
        setStage(response.data.stage.type);
        setAdmin(new Player(response.data.lobby.admin));
      } catch (error) {
        console.error(error);
      }
    }, [lobbyId]);

    const fetchPoll = useCallback(async () => {
      try{
        const response = await api.get(`/games/${lobbyId}/polls`);
        setPoll(response.data);

        // maybe call these functions outside of try catch block to properly catch errors
        updateVoteMap(response.data);
        updateVoteParticipants(response.data);
        updateOwnVote(response.data);
        setScheduledFinish(new Date(response.data.scheduledFinish));
        setQuestion(response.data.question);
        setVotingParty(response.data.role);
      } catch (error) {
        console.error("Details", error);
        alert(
          "Something went wrong fetching the poll. See console for details."
        );
      }
    }, [lobbyId]);

    // const fetchWinner = ....

    // TODO: fetchPoll and fetchGame again every time the scheduledFinish is reached
    // TODO: everytime after that: isFinished = true? --> GET /game/id/winner

    useEffect(() => {
      setTimeout(() => {
        async function fetchData() {
          await fetchGame();
          await fetchPoll();
          setStarted(true);
          setInterval(async () => {
            await fetchPoll();
          }, 1000);
          setInterval(async () => {
            await fetchGame();
          }, 1000);
        }
        fetchData().then();
      }, 3000);
    }, [lobbyId, token]);

    return {started, stage, lobby, admin, voteMap, votingParty, question, voteParticipants, scheduledFinish, finished, endData, ownVote};
}