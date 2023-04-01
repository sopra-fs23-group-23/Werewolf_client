import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { api } from 'helpers/api';
import Spinner from 'components/ui/Spinner';
import FormField from 'components/ui/FormField';
import 'styles/views/Edit.scss';

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
          password
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
      <form onSubmit={(e) => updateUser(e)}>
        {content}
        <FormField
          label="Username"
          value={username}
          onChange={(un) => setUsername(un)}
        />
        <FormField
          label="Password"
          value={password}
          type="password"
          onChange={(n) => setPassword(n)}
        />
      </form>
    );
  }

  return (
    <div className="background background-dark edit">
      <div className="container">
        <div className="edit">
          <div className="column-container">
            <h1>Edit User</h1>
            {content}
            <button className="btn btn-light"
                    onClick={() => updateUser()}
            >
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
      </div>
    </div>
  );
};

export default Edit;
