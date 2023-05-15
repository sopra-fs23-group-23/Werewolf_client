import { useState, useEffect } from 'react';
import { api } from 'helpers/api';
import 'styles/ui/RolePopup.scss';
import StorageManager from "../../helpers/StorageManager";
import Spinner from "../ui/Spinner";
import PropTypes from 'prop-types';

const RolePopup = ({ show, handleClose, stage }) => {
  const id = StorageManager.getUserId();
  const lobbyId = StorageManager.getLobbyId();
  // eslint-disable-next-line
  const [allRoles, setAllRoles] = useState([]);
  // eslint-disable-next-line
  const [ownRoles, setOwnRoles] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const filterOutVillagers = (roleList) => {
    for(const role of roleList) {
      if(role.roleName !== "Villager") {
        continue;
      }
      for(const innerRole of roleList) {
        if((innerRole.roleName === "Hunter") || (innerRole.roleName === "Cupid" || (innerRole.roleName === "Seer") ||
          (innerRole.roleName === "Witch"))) {
          role.amount -= innerRole.amount;
        }
      }
    }
    return roleList;
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const responseAll = await api.get('/lobbies/' + lobbyId + "/roles");
        const filteredRoles = filterOutVillagers(responseAll.data);
        setAllRoles(filteredRoles);
        const responseOwn = await api.get('/lobbies/' + lobbyId + "/roles/" + id);
        setOwnRoles(responseOwn.data);
        allRoles.forEach((role, index) => {
          if(role.roleName === ownRoles[0].roleName) {
            setActiveIndex(index);  // show own role first when opening popup
          }
        });
      } catch (error) {
        console.log(error)
        alert('Could not fetch role information' + error.response.data?.message);
        console.error(error);
      }
    }
    fetchData();
    //eslint-disable-next-line
  }, [id, lobbyId]);

  const nextRole = () => {
    setActiveIndex((activeIndex + 1) % allRoles.length);
  }

  const previousRole = () => {
    setActiveIndex((activeIndex + 1) % allRoles.length);
  }

  const handleClickOutsidePopup = (e) => {
    if(e.target.classList.contains('role-popup-background')) {
      handleClose();
    }
  }

  if(ownRoles.length === 0 || allRoles.length === 0) {
    return <Spinner theme="light"/>
  } else if(!show) {
    return <div></div>;
  } else {
    return (
      <div className='role-popup-background' onClick={handleClickOutsidePopup}>
        <div className={'role-popup-container ' + (stage === 'Day' ? 'background-light' : 'background-dark')}>
          <img src='/static/media/close.svg' className='role-popup-close' onClick={handleClose} alt='close'/>
          {allRoles.map((role, index) => 
            <div className={'role-popup-item ' + (index === activeIndex ? 'active' : '')} key={index}>
              <div className={'role-popup-item-indicator ' + (role.roleName === ownRoles[0].roleName ? 'active' : '')}>Your Role:</div>
              <h2 className='role-popup-item-title'>{ role.roleName }</h2>
              <img className='role-popup-item-image' src={`/static/media/${role.roleName}-${(stage === 'Day' ? "light" : "dark")}.png`}
                   alt={"Picture of a " + role.roleName}/>
              <div className='role-popup-item-description'>{ role.description }</div>
              <div className='role-popup-item-amount'>Players with this role at game start: { role.amount }</div>
            </div>
          )}
          <div className='role-popup-nav'>
            <img src='/static/media/back.svg' alt='back' onClick={previousRole} />
            <img src='/static/media/forward.svg' alt='back' onClick={nextRole} />
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