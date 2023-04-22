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
    const [admin, setAdmin] = useState(false);
    const [voteMap, setVoteMap] = useState(new Map());
    const [hitlist, setHitlist] = useState([]);

    const MockPollOptions = [
      {
        "player": {
          "id": 1,
          "name": "David",
          "avatarUrl": "https://api.dicebear.com/6.x/miniavs/svg?seed=1",
          "alive": true
        },
        "supporters": [
          {
            "id": 2,
            "name": "Miro",
            "avatarUrl": "https://api.dicebear.com/6.x/miniavs/svg?seed=2",
            "alive": true
          },
          {
            "id": 3,
            "name": "Jan",
            "avatarUrl": "https://api.dicebear.com/6.x/miniavs/svg?seed=3",
            "alive": true
          },
          {
            "id": 4,
            "name": "Marvin",
            "avatarUrl": "https://api.dicebear.com/6.x/miniavs/svg?seed=4",
            "alive": true
          },
          {
            "id": 5,
            "name": "Michel",
            "avatarUrl": "https://api.dicebear.com/6.x/miniavs/svg?seed=5",
            "alive": true
          },
          {
            "id": 6,
            "name": "Rudi",
            "avatarUrl": "https://api.dicebear.com/6.x/miniavs/svg?seed=6",
            "alive": true
          },
          {
            "id": 7,
            "name": "Balthasar",
            "avatarUrl": "https://api.dicebear.com/6.x/miniavs/svg?seed=7",
            "alive": true
          },
          {
            "id": 8,
            "name": "Salamander",
            "avatarUrl": "https://api.dicebear.com/6.x/miniavs/svg?seed=8",
            "alive": true
          },
          {
            "id": 9,
            "name": "Roland",
            "avatarUrl": "https://api.dicebear.com/6.x/miniavs/svg?seed=9",
            "alive": true
          },
          {
            "id": 10,
            "name": "Matthias",
            "avatarUrl": "https://api.dicebear.com/6.x/miniavs/svg?seed=10",
            "alive": true
          },
          {
            "id": 11,
            "name": "ChlineSaurus",
            "avatarUrl": "https://api.dicebear.com/6.x/miniavs/svg?seed=11",
            "alive": true
          }
        ]
      }
    ];
    const updateDataToLobby = useCallback((data) => {
      console.log("updateDataToGame", data.lobby)
      const lobby = new LobbyModel(data.lobby);
      setLobby(lobby);

    }, []);

    const updateVoteMap = useCallback((data) => {
      data = MockPollOptions;
      const newVoteMap = new Map();
      console.log("updateVoteMap in Game", data.pollOptions)
      data.pollOptions.forEach(option => {
        option.supporters.forEach(supporter => {
          newVoteMap.set(option.player.id, supporter.id)
          console.log(option.player.id, "votes for (Mock)", supporter.id)
        })
      });
      
      lobby.players.forEach(player => {
        if (player.id < 4) {
          newVoteMap.set(player.id, lobby.players[0].id)
        } else if (player.id < 7) {
          newVoteMap.set(player.id, lobby.players[1].id)
        } else {
          newVoteMap.set(player.id, lobby.players[2].id)
        }
      });

      setVoteMap(newVoteMap);
    }, []);

    // const updateVoteMap = useCallback((data) => {
    //   console.log("updateVoteMap in Game", data.pollOptions)
    //   const lobby = new LobbyModel(data.lobby);
    //   const newVoteMap = new Map();
    //   lobby.players.forEach(player => {
    //     if (player.id < 4) {
    //       newVoteMap.set(player.id, lobby.players[0].id)
    //     } else if (player.id < 7) {
    //       newVoteMap.set(player.id, lobby.players[1].id)
    //     } else {
    //       newVoteMap.set(player.id, lobby.players[2].id)
    //     }
    //  });
    //   setVoteMap(newVoteMap);

    // // }, []);

    const updateHitlist = useCallback(() => {

      const newHitlist = [];

      for (const [key, value] of voteMap.entries()) {
        if (key === value) {
          newHitlist.push(key);
        }
      }
      setHitlist(newHitlist);
    }, [voteMap]);

    const subscribeToEmitter = useCallback((lobbyId, token) =>{
        const eventSource = createEventSource(`games/${lobbyId}/sse/${token}`);
        eventSource.addEventListener("start", (event) => {
            setStarted(true);
        });
        eventSource.addEventListener("stage", (event)=>{
          console.log("Stage started:", event.data);
          updateDataToLobby(JSON.parse(event.data));


        })
        eventSource.addEventListener("poll", (event)=>{
          console.log("Poll started:", event.data);
          updateVoteMap(JSON.parse(event.data));
          updateHitlist(JSON.parse(event.data));
          //print key value pairs of votemap
          for (const [key, value] of voteMap.entries()) {
            console.log(`${key} votes for ${value}`);
          }
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

    return {started, stage, lobby, admin, voteMap, hitlist};
}