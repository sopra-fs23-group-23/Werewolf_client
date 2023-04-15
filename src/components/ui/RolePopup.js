import { api } from 'helpers/api';
import 'styles/ui/PopupRole.scss';
import StorageManager from "../../helpers/StorageManager";

const RolePopup = ({ show }) => {
  const id = StorageManager.getUserId();
  const lobbyId = StorageManager.getLobbyId();

  const allRoles = [];
  const ownRole = [];

  if(show) {
    return (
      <div className='popup-role background-dark'>
        Your Role:
      </div>
    );
  }
  return <div></div>;
}

export default RolePopup;