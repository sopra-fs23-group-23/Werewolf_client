import { useEffect, useState } from 'react';
import { api, handleError } from 'helpers/api';
import { Spinner } from 'components/ui/Spinner';
import { Button } from 'components/ui/Button';
import { useHistory, Link } from 'react-router-dom';
import BaseContainer from 'components/ui/BaseContainer';
import PropTypes from 'prop-types';
import 'styles/views/Game.scss';

const Player = ({ user }) => {
  const isCurrentUser =
    user.id === parseInt(localStorage.getItem('uid')) ? 'current' : '';
  return (
    <div className={'player container ' + isCurrentUser}>
      <Link to={'/game/user/' + user.id} className="player username">
        {user.username}
      </Link>
      <div className={'player status ' + user.status}>{user.status}</div>
      <div className="player id">id: {user.id}</div>
    </div>
  );
};

Player.propTypes = {
  user: PropTypes.object,
};

const Game = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();

  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  // a component can have as many state variables as you like.
  // more information can be found under https://reactjs.org/docs/hooks-state.html
  const [users, setUsers] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const logout = async () => {
    try {
      await api.put('/logout');
    } catch (error) {
      console.error(error);
      alert('Logout failed. See console for details.');
    }
    localStorage.removeItem('token');
    localStorage.removeItem('uid');
    history.push('/login');
  };

  // the effect hook can be used to react to change in your component.
  // in this case, the effect hook is only run once, the first time the component is mounted
  // this can be achieved by leaving the second argument an empty array.
  // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const allUsersResponse = await api.get('/users');
        const currentUserResponse = await api.get(
          '/users/' + localStorage.getItem('uid')
        );
        setUsers(allUsersResponse.data);
        setCurrentUser(currentUserResponse.data);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the users: \n${handleError(
            error
          )}`
        );
        console.error('Details:', error);
        alert(
          'Something went wrong while fetching the users! See the console for details.'
        );
      }
    }

    fetchData();
  }, []);

  let content = <Spinner />;
  let name = '';

  if (users) {
    content = (
      <div className="game">
        <ul className="game user-list">
          {users.map((user) => (
            <Player user={user} key={user.id} />
          ))}
        </ul>
        <Button width="100%" onClick={() => logout()}>
          Logout
        </Button>
      </div>
    );
  }
  if (currentUser) {
    name = currentUser.username;
  }

  return (
    <BaseContainer className="game container">
      <h2>All Users</h2>
      <p className="game paragraph">
        Logged in user: <strong>{name}</strong>
      </p>
      {content}
    </BaseContainer>
  );
};

export default Game;
