import {useEffect, useState} from 'react';
import {api} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";
import "styles/views/Edit.scss";
import { useParams } from 'react-router-dom'
import FormField from 'components/ui/FormField';

const Edit = () => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [birthday, setBirthDate] = useState('');
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get('/users/' + id);
        // check if is current logged in user
        if(response.data.id !== parseInt(localStorage.getItem('uid'))) {
          alert("Cannot enter edit page for other user.");
          history.push('/game/dashboard');
        }
        // format date such that it fits in the value attribute of the date input
        const birthday = response.data.birthday;
        let formattedBirthday = new Date(response.data.birthday).toISOString().substring(0, 10);
        if(!birthday) {
          formattedBirthday = '';
        }
        setUsername(response.data.username);
        setBirthDate(formattedBirthday);
      } catch (error) {
        alert("Could not fetch user with ID " + id + ".");
        history.push('/game/dashboard');
      }
    }
    fetchData();
  }, [history, id]);

  function updateUser() {
    async function putData() {
      try {
        await api.put('/users/' + id, {
          username,
          birthday
        });
        history.push('/game/user/' + id);
      } catch (error) {
        alert(error.response.data?.message || "Update failed.")
      }
    }
    putData();
  }

  let content = <Spinner/>;

  if (username) {
    content = (
      <div className='edit information'>
        <FormField
            label="Username"
            value={username}
            onChange={un => setUsername(un)}
          />
        <FormField
            label="Birthday"
            value={birthday}
            type="date"
            onChange={un => setBirthDate(un)}
          />
      </div>
    );
  }

  return (
    <BaseContainer className="game container">
      <h2>Edit User</h2>
      <p className="game paragraph">Get user information from secure endpoint:</p>
      { content }
      <Button width="100%" className="user button" onClick={() => updateUser()}>Save Changes</Button>
      <Button width="100%" onClick={() => history.push('/game/user/' + id)}>Back to User</Button>
    </BaseContainer>
  );
}

export default Edit;
