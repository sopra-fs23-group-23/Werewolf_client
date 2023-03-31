import { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { api } from 'helpers/api';
import Spinner from 'components/ui/Spinner';
import 'styles/views/User.scss';

const User = () => {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get('/users/' + id);
        setUser(response.data);
      } catch (error) {
        console.error(error);
        alert('Could not fetch user with ID ' + id);
        history.push('/home');
      }
    }
    fetchData();
  }, [history, id]);

  function isCurrentUser() {
    return id === localStorage.getItem('uid');
  }

  let content = <Spinner />;

  if (user) {
    content = (
      <table>
        <tbody>
          <tr>
            <td>Username</td>
            <td>{user.username}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td className={'user ' + user.status}>{user.status}</td>
          </tr>
        </tbody>
      </table>
    );
  }

  return (
    <div className="background background-dark">
      <div className="container">
        <h2>User Details</h2>
        {content}
        {isCurrentUser() ? (
          <>
            <button
              className="btn btn-light"
              onClick={() => history.push('/edit/' + id)}
            >
              Edit Profile
            </button>
            <br />
            <button className="btn btn-danger">Delete Profile</button>
            <br />
          </>
        ) : (
          ''
        )}
        <button className="btn btn-light" onClick={() => history.push('/home')}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default User;
