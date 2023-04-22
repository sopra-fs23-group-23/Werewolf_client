import StorageManager from "helpers/StorageManager";
import { createEventSource } from "helpers/createEventSource";
import { useCallback, useEffect, useState} from "react";
import LobbyModel from "models/Lobby";
import Player from "models/Player";

export const useGame = () => {
    const lobbyId = StorageManager.getLobbyId();
    const token = StorageManager.getUserToken();
    const [started, setStarted] = useState(false);
    const [stage, setStage] = useState(0);
    const [lobby, setLobby] = useState(null);
    const [admin, setAdmin] = useState(false);
    const [voteMap, setVoteMap] = useState(new Map());
    const [voteParticipants, setVoteParticipants] = useState([]);
    const [scheduledFinish, setScheduledFinish] = useState(null);
    const [hitlist, setHitlist] = useState([]);
    const [finished, setFinished] = useState(false);
    const [endData, setData] = useState(null);

    const MockPollOptions = {"question":"Who do you suspect to be a werewolf?","participants":[{"id":1,"name":"David","avatarUrl":"https://api.dicebear.com/6.x/miniavs/svg?seed=1","alive":true},{"id":2,"name":"Miro","avatarUrl":"https://api.dicebear.com/6.x/miniavs/svg?seed=2","alive":true},{"id":3,"name":"Jan","avatarUrl":"https://api.dicebear.com/6.x/miniavs/svg?seed=3","alive":true},{"id":4,"name":"Marvin","avatarUrl":"https://api.dicebear.com/6.x/miniavs/svg?seed=4","alive":true},{"id":5,"name":"Michel","avatarUrl":"https://api.dicebear.com/6.x/miniavs/svg?seed=5","alive":true},{"id":6,"name":"Rudi","avatarUrl":"https://api.dicebear.com/6.x/miniavs/svg?seed=6","alive":true},{"id":7,"name":"Balthasar","avatarUrl":"https://api.dicebear.com/6.x/miniavs/svg?seed=7","alive":true},{"id":8,"name":"Salamander","avatarUrl":"https://api.dicebear.com/6.x/miniavs/svg?seed=8","alive":true},{"id":9,"name":"Roland","avatarUrl":"https://api.dicebear.com/6.x/miniavs/svg?seed=9","alive":true},{"id":10,"name":"Matthias","avatarUrl":"https://api.dicebear.com/6.x/miniavs/svg?seed=10","alive":true},{"id":11,"name":"ChlineSaurus","avatarUrl":"https://api.dicebear.com/6.x/miniavs/svg?seed=11","alive":true}],
    "pollOptions":[
      {"player":{"id":1,"name":"David","avatarUrl":"https://api.dicebear.com/6.x/miniavs/svg?seed=1","alive":true},
      "supporters":[
        {"id":2,"name":"Mike","avatarUrl":"https://api.dicebear.com/6.x/miniavs/svg?seed=12","alive":true},
        {"id":3,"name":"Emily","avatarUrl":"https://api.dicebear.com/6.x/miniavs/svg?seed=13","alive":true},
        {"id":4,"name":"Sarah","avatarUrl":"https://api.dicebear.com/6.x/miniavs/svg?seed=14","alive":true}
      ]},
        {"player":{"id":2,"name":"Miro","avatarUrl":"https://api.dicebear.com/6.x/miniavs/svg?seed=2","alive":true},
        "supporters":[
          {"id":5,"name":"John","avatarUrl":"https://api.dicebear.com/6.x/miniavs/svg?seed=15","alive":true},
          {"id":6,"name":"Linda","avatarUrl":"https://api.dicebear.com/6.x/miniavs/svg?seed=16","alive":true},
          {"id":8,"name":"Yoda","avatarUrl":"https://api.dicebear.com/6.x/miniavs/svg?seed=16","alive":true},
          {"id":7,"name":"Nina","avatarUrl":"https://api.dicebear.com/6.x/miniavs/svg?seed=17","alive":true}
        ]},
        {"player":{"id":5,"name":"John","avatarUrl":"https://api.dicebear.com/6.x/miniavs/svg?seed=2","alive":true},
        "supporters":[
          {"id":5,"name":"John","avatarUrl":"https://api.dicebear.com/6.x/miniavs/svg?seed=15","alive":true},
          {"id":6,"name":"Linda","avatarUrl":"https://api.dicebear.com/6.x/miniavs/svg?seed=16","alive":true},
        ]},
        {"player":{"id":6,"name":"Linda","avatarUrl":"https://api.dicebear.com/6.x/miniavs/svg?seed=2","alive":true},
        "supporters":[
          {"id":5,"name":"John","avatarUrl":"https://api.dicebear.com/6.x/miniavs/svg?seed=15","alive":true},
          {"id":6,"name":"Linda","avatarUrl":"https://api.dicebear.com/6.x/miniavs/svg?seed=16","alive":true},
          {"id":1,"name":"David","avatarUrl":"https://api.dicebear.com/6.x/miniavs/svg?seed=15","alive":true},
          {"id":2,"name":"Röbi","avatarUrl":"https://api.dicebear.com/6.x/miniavs/svg?seed=16","alive":true},
          {"id":7,"name":"Nina","avatarUrl":"https://api.dicebear.com/6.x/miniavs/svg?seed=17","alive":true}
        ]}
        ]};


    const updateDataToLobby = useCallback((data) => {
      console.log("updateDataToGame", data.lobby)
      const lobby = new LobbyModel(data.lobby);
      setLobby(lobby);

    }, []);

    const updateVoteMap = useCallback((data) => {
      data = MockPollOptions;
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
        newVoteMap.set(new Player(option.player), supporterArray)

      });
      console.log("VoteMap final: ", newVoteMap)
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
          setScheduledFinish(new Date(dataJSON.scheduledFinish));
          console.log("scheduledFinish: ", new Date(scheduledFinish));
        })

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

      

    return {started, stage, lobby, admin, voteMap, voteParticipants, scheduledFinish, finished, endData};
}