import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { api } from 'helpers/api';
import 'styles/views/Information.scss';
import Role from 'models/Role';
import RoleInformation from "../ui/RoleInformation";
import Spinner from "../ui/Spinner";

const Information = () => {
  //const id = sessionStorage.getItem('uid')
  const id = 6;
  const history = useHistory();
  let roles;
  const [lobbyId, setLobbyId] = useState('');
  const [ownRole, setOwnRole] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get('/lobbies/' + lobbyId + "/roles");
      } catch (error) {
        alert('Could not fetch role data, continue with fake role');
        console.error(error);
        let testRoles = [];
        let werewolf = new Role();
        werewolf.description = "Lorem ipsum dolor sit amet, detraxit sensibus nam ne, qui quas velit et, eam cu augue impetus efficiantur. Intellegebat definitiones usu te. Mei an esse ludus quaestio. Cetero constituto neglegentur eu sit, ut mel quando decore inimicus. Cu sale labore eruditi eos, dolorem pertinacia id quo."
        werewolf.amount = 5;
        werewolf.uid = [1,2,3,4,5];
        werewolf.rolename = "Werewolf";
        let villager = new Role();
        villager.description = "ide has inani scribentur mediocritatem. Ei unum altera vis, tantas alterum nec at. Has et noster iisque, no delicata salutatus sit. Cetero fastidii usu ei, legere voluptatibus ut his. An utroque sadipscing theophrastus mei, ut noster oporteat pri, partem possim gubergren in vim."
        villager.amount = 4;
        villager.uid = [6,7,8,9];
        villager.rolename = "Villager";
        testRoles.push(werewolf);
        testRoles.push(villager);
        roles = testRoles;
      }
      findOwnRole();
    }
    fetchData();
  }, []);

  const findOwnRole = () => {
    for (let i = 0; i < roles.length; i++) {
      for (let j = 0; j < roles[i].uid.length; j++) {
        if (id === roles[i].uid[j]) {
          setOwnRole(roles[i]);
        }
      }
    }
  }
  const displayContent = () => {
    if(!ownRole) {
      console.log(ownRole);
      return <h1>Loading...</h1>
    }
    return (
      <div className="own-role-container">
        <RoleInformation role={ownRole} ownRole={true} displayCount={false}/>
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