import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { api } from 'helpers/api';
import Spinner from 'components/ui/Spinner';
import FormField from 'components/ui/FormField';
import 'styles/views/Game.scss';
import 'styles/views/Edit.scss';

const Edit = () => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get('/users/' + id);
        // check if is current logged in user
        if (response.data.id !== parseInt(localStorage.getItem('uid'))) {
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
        });
        history.push('/user/' + id);
      } catch (error) {
        alert(error.response.data?.message || 'Update failed.');
      }
    }
    putData();
  }

  let content = <Spinner />;

  if (username) {
    content = (
      <FormField
        label="Username"
        value={username}
        onChange={(un) => setUsername(un)}
      />
    );
  }

  return (
    <div className="background background-dark">
      <div className="container">
        <h2>Edit User</h2>
        {content}
        <button className="btn btn-light" onClick={() => updateUser()}>
          Save Changes
        </button>
        <button
          className="btn btn-light"
          onClick={() => history.push('/user/' + id)}
        >
          Back to User
        </button>
      </div>
    </div>
  );
};

export default Edit;
