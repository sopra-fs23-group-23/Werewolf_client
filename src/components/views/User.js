import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";
import "styles/views/User.scss";
import { useParams } from 'react-router-dom'

const User = () => {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get('/users/' + id);
        //await new Promise(resolve => setTimeout(resolve, 300));
        // format creationDate and birthday before saving to state
        const creationDateRaw = new Date(response.data.creationDate);
        response.data.creationDate = creationDateRaw.toLocaleDateString();
        if(response.data.birthday) {
          const birthdayRaw = new Date(response.data.birthday);
          response.data.birthday = birthdayRaw.toLocaleDateString();
        }
        setUser(response.data);
      } catch (error) {
        console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Could not fetch user with ID '" + id + "'");
        history.push('/game/dashboard');
      }
    }
    fetchData();
  }, [history, id]);

  function isCurrentUser() {
    return id === localStorage.getItem('uid');
  }

  let content = <Spinner/>;

  if (user) {
    content = (
      <table className="user information">
        <tbody>
          <tr>
            <td>Username</td>
            <td>{ user.username }</td>
          </tr>
          <tr>
            <td>Status</td>
            <td className={"user " + user.status}>{ user.status }</td>
          </tr>
          <tr>
            <td>Date Joined</td>
            <td>{ user.creationDate }</td>
          </tr>
          <tr>
            <td>Birth Date</td>
            <td>{ user.birthday || 'unknown' }</td>
          </tr>
        </tbody>
      </table>
    );
  }

  return (
    <BaseContainer className="game container">
      <h2>User Details</h2>
      <p className="game paragraph">
        Get user information from secure endpoint:
      </p>
      { content }
      { isCurrentUser() ? <Button width="100%" className="user button" onClick={() => history.push('/game/edit/'+id)}>Edit Profile</Button> : '' }
      <Button width="100%" onClick={() => history.push('/game/dashboard')}>Back to Dashboard</Button>
    </BaseContainer>
  );
}

export default User;
