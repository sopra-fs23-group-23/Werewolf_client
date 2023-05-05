import { useState, useEffect } from 'react';
import { api } from 'helpers/api';
import 'styles/ui/EventLog.scss';
import StorageManager from "../../../helpers/StorageManager";
import Spinner from "../../ui/Spinner";
import PropTypes from 'prop-types';

const EventPopup = ({ show, handleClose, stage }) => {
  const id = StorageManager.getUserId();
  const lobbyId = StorageManager.getLobbyId();
  const handleClickOutsidePopup = (e) => {
    if(e.target.classList.contains('log-popup-background')) {
      handleClose();
    }
  }

  if(false) {
    return <Spinner theme="light"/>
  } else if(!show) {
    return <div></div>;
  } else {
    return (
      <div className='log-popup-background' onClick={handleClickOutsidePopup}>
        <div className={'log-popup-container ' + (stage === 'Day' ? 'background-light' : 'background-dark')}>
          <img src='/static/media/close.svg' className='log-popup-close' onClick={handleClose} alt='close'/>
          <h2 className='log-popup-title'>History</h2>
        </div>
      </div>
    );
  }
}

EventPopup.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func
};


export default EventPopup;