import { useState, useEffect } from 'react';
import { api } from 'helpers/api';
import 'styles/ui/RolePopup.scss';
import StorageManager from "../../helpers/StorageManager";
import Spinner from "../ui/Spinner";
import PropTypes from 'prop-types';

const RolePopup = ({ show, handleClose }) => {
  const id = StorageManager.getUserId();
  const lobbyId = StorageManager.getLobbyId();
  const [allRoles, setAllRoles] = useState([]);
  const [ownRoles, setOwnRoles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const responseAll = await api.get('/lobbies/' + lobbyId + "/roles");
        setAllRoles(responseAll.data);
        const responseOwn = await api.get('/lobbies/' + lobbyId + "/roles/" + id);
        setOwnRoles(responseOwn.data);
      } catch (error) {
        console.log(error)
        //alert('Could not fetch role information' + error.response.data?.message);
        console.error(error);
      }
    }
    fetchData();
  }, [id, lobbyId]);

  if(ownRoles.length === 0 || allRoles.length === 0) {
    return <Spinner theme="light"/>
  } else if(!show) {
    return <div></div>;
  } else {
    return (
      <div className='role-popup-background'>
        <div className='role-popup-container background-dark'>
          <img src='/assets/images/icons/close.svg' className='role-popup-close' onClick={handleClose} />
          {allRoles.map(role => 
            <div className={'role-popup-item'} key={role.roleName}>
              {(role.roleName === ownRoles[0].roleName) && <div>Your Role:</div>}
              <h2 className='role-popup-item-title'>{ role.roleName }</h2>
              <img className='role-popup-item-image' src={`/assets/images/roles/${role.roleName}.png`} alt={"Picture of a " + role.roleName}/>
              <div className='role-popup-item-description'>{ role.description }</div>
              <div className='role-popup-item-amount'>Players with this role at game start: { role.amount }</div>
            </div>
          )}
          <div className='role-popup-nav'>
            <img src='/assets/images/icons/back.svg' alt='back' />
            <img src='/assets/images/icons/forward.svg' alt='back' />
          </div>
        </div>
      </div>
    );
  }
}

RolePopup.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func
};


export default RolePopup;