import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { api } from 'helpers/api';
import 'styles/views/Information.scss';
import Role from 'models/Role';
import RoleColumn from "../ui/information/RoleColumn";
import RoleInformation from "../ui/information/RoleInformation";
import Spinner from "../ui/Spinner";


const Information = () => {
  //const id = sessionStorage.getItem('uid')
  const id = 6;
  const history = useHistory();
  const [allRoles, setAllRoles] = useState([]);
  const [lobbyId, setLobbyId] = useState('');
  const [ownRole, setOwnRole] = useState('');
  const [showAllRoles, setShowAllRoles] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get('/lobbies/' + lobbyId + "/roles");
         setAllRoles(response.data);
      } catch (error) {
        alert('Could not fetch role data, continue with fake role');
        console.error(error);
        let testRoles = [];
        let werewolf = new Role();
        werewolf.description = "Lorem ipsum dolor sit amet, detraxit sensibus nam ne, qui quas velit et, eam cu augue impetus efficiantur. Intellegebat definitiones usu te. Mei an esse ludus quaestio. Cetero constituto neglegentur eu sit, ut mel quando decore inimicus. Cu sale labore eruditi eos, dolorem pertinacia id quo."
        werewolf.uid = [1,2,3,4,5];
        werewolf.rolename = "Werewolf";
        let villager = new Role();
        villager.description = "ide has inani scribentur mediocrita tem. Ei unum altera vis, tantas alterum nec at. Has et noster iisque, no delicata salutatus sit. Cetero fastidii usu ei, legere voluptatibus ut his. An utroque sadipscing theophrastus mei, ut noster oporteat pri, partem possim gubergren in vim."
        villager.uid = [6,7,8,9];
        villager.rolename = "Villager";
        testRoles.push(werewolf);
        testRoles.push(villager);
        setAllRoles(testRoles);
      }
    }
    fetchData();
  }, []);

  const findOwnRole = () => {
    for (let i = 0; i < allRoles.length; i++) {
      for (let j = 0; j < allRoles[i].uid.length; j++) {
        if (id === allRoles[i].uid[j]) {
          setOwnRole(allRoles[i]);
        }
      }
    }
  }

  const displayContent = () => {
    console.log("II all roles: ")
    console.log(allRoles)
    console.log("II own role: ")
    console.log(ownRole)
    if(!ownRole || !allRoles) {
      return <Spinner theme="light"/>
    } else if (showAllRoles) {
      return (
        <div className="all-role-container">
          <h5>Roles this game</h5>
          <RoleColumn roles={allRoles} />
          <p>Your assigned role and the roles in the game can be viewed during the game by clicking the info button.</p>
          <h5>Game starts in:</h5>
          <h5>0:31</h5>
        </div>
      );
    }
    return (
      <div className="own-role-container">
        <RoleInformation role={ownRole} isOwnRole={true} displayCount={false}/>
        <h5>Game starts in:</h5>
        <h5>0:31</h5>
      </div>
    )
  }

  if(allRoles && !ownRole) {
    findOwnRole();
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