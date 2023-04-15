import { useState, useEffect } from 'react';
import { api } from 'helpers/api';
import 'styles/ui/RolePopup.scss';
import StorageManager from "../../helpers/StorageManager";
import SingleRoleInformation from './SingleRoleInformation';

const RolePopup = ({ show }) => {
  const id = StorageManager.getUserId();
  const lobbyId = StorageManager.getLobbyId();
  const [allRoles, setAllRoles] = useState([]);
  const [ownRoles, setOwnRoles] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const responseAll = await api.get('/lobbies/' + lobbyId + "/roles");
        setAllRoles(responseAll.data);
        const responseOwn = await api.get('/lobbies/' + lobbyId + "/roles/" + id);
        setOwnRoles(responseOwn.data);
      } catch (error) {
        alert('Could not fetch role information' + error.response.data?.message);
        console.error(error);
      }
    }
    fetchData();
  }, [id, lobbyId]);

  if(show) {
    return (
      <div className='role-popup background-dark'>
        {allRoles.map(role => 
          <div className='role-popup-item' key={role.roleName}>
            {(role.roleName === ownRoles[0].roleName) && <div>Your Role:</div>}
            <h2 className='role-popup-item-title'>{ role.roleName }</h2>
            <div className='role-popup-item-description'>{ role.description }</div>
            <div className='role-popup-item-amount'>{ role.amount }</div>
          </div>
        )}
        <div className='role-popup-nav'>Back | Forward</div>
      </div>
    );
  }
  return <div></div>;
}

export default RolePopup;