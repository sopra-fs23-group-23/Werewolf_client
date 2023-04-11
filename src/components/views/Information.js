import { useState, useEffect } from 'react';
import {useHistory} from 'react-router-dom';
import { api } from 'helpers/api';
import 'styles/views/Information.scss';
import Role from 'models/Role';
import AllRolesColumn from "../ui/AllRolesColumn";
import SingleRoleInformation from "../ui/SingleRoleInformation";
import Spinner from "../ui/Spinner";
import StorageManager from "../../helpers/StorageManager";

const Information = () => {
  const id = StorageManager.getUserId();
  const lobbyId = StorageManager.getLobbyId();
  const history = useHistory();
  const [allRoles, setAllRoles] = useState([]);
  const [ownRoles, setOwnRoles] = useState([]);
  const [showAllRoles, setShowAllRoles] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const responseAll = await api.get('/lobbies/' + lobbyId + "/roles");
        setAllRoles(responseAll.data);
        const responseOwn = await api.get('/lobbies/' + lobbyId + "/roles/" + id);
        setOwnRoles(responseOwn.data);
      } catch (error) {
        alert('Could not fetch role data, continue with fake role\n' + error.response.data?.message);
        console.error(error);
      }
    }
    fetchData();
  }, [id, lobbyId]);

  const displayContent = () => {
    if((ownRoles.length === 0) || (allRoles.length === 0)) {
      return <Spinner theme="light"/>
    } else if (showAllRoles) {
      return (
        <div className="all-role-container">
          <h5>Roles in this game</h5>
          <AllRolesColumn roles={allRoles} />
          <p>Your assigned role and the roles in the game can be viewed during the game by clicking the info button.</p>
          <h5>Game starts in:</h5>
          <h5>0:31</h5>
        </div>
      );
    }
    return (
      <div className="own-role-container">
        <SingleRoleInformation roles={ownRoles} isOwnRole={true} displayCount={false}/>
        <h5>Game starts in:</h5>
        <h5>0:31</h5>
      </div>
    )
  }
  return (
    <div className="background background-dark-image information">
      <div className="container">
        {displayContent()}
      </div>
    </div>
  );
};
export default Information;