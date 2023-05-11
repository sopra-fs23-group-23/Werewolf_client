import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { api } from 'helpers/api';
import Spinner from 'components/ui/Spinner';
import FormField from 'components/ui/FormField';
import 'styles/views/Edit.scss';
import StorageManager from 'helpers/StorageManager';

const Edit = () => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get('/users/' + id);
        // check if is current logged in user
        if (response.data.id !== parseInt(StorageManager.getUserId())) {
          alert('Cannot enter edit page for other user.');
          history.push('/home');
        }
        setUsername(response.data.username);
      } catch (error) {
        alert('Could not fetch user with ID ' + id + '.');
        history.push('/home');
      }
    }
    fetchData();
  }, [history, id]);

  function updateUser() {
    async function putData() {
      try {
        await api.put('/users/' + id, {
          username,
          password
        });
        history.push('/user/' + id);
      } catch (error) {
        alert(error.response.data?.message || 'Update failed.');
      }
    }
    putData();
  }

  let content = <Spinner theme="light"/>;

  if (username) {
    content = (
      <form onSubmit={(e) => updateUser(e)}>
        <FormField
          theme="light"
          label="Username"
          value={username}
          onChange={(un) => setUsername(un)}
        />
        <FormField
          theme="light"
          label="Password"
          value={password}
          type="password"
          onChange={(n) => setPassword(n)}
        />
        <button className="btn btn-light edit-savebutton"
                disabled={!username || !password}
                onClick={() => updateUser()}
        >
          Save Changes
        </button>
      </form>
    );
  }

  return (
    <div className="background background-dark">
      <div className="container">
        <div className="edit">
          <button
            className="btn btn-light edit-backbutton"
            onClick={() => history.push('/user/' + id)}>
              Back to User
            </button>
          <h1>Edit User</h1>
          {content}
        </div>
      </div>
    </div>
  );
};

export default Edit;
