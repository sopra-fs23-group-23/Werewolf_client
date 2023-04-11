import 'styles/views/Lobby.scss';
import Spinner from 'components/ui/Spinner';
import { useLobby } from 'hooks/Lobby.hooks';


const Profile = ({user}) => (
  <div className="lobby-profile">
      <img
        src="https://tse2.mm.bing.net/th?id=OIP.gstkHSUl8M3MtSWnIY0xhgHaHa&pid=Api&P=0"
        alt="Panda profile"
      />
      <p>{user.name}</p>
  </div>
)

const ButtonMenu = ({isAdmin}) => {
  function leave() {
    // TODO
    alert("Not implemented yet");
  }

  function startGame () {
    // TODO
    alert("Not implemented yet");
  }

  if (isAdmin) {
    return (
      <div>
        <button className="btn btn-light" onClick={leave}>
          Dissolve Lobby
        </button>
        <button className="btn btn-light" onClick={startGame}>
          Start Game
        </button>
      </div>
    )
  } else {
    return (
      <div>
        <button className="btn btn-light" onClick={leave}>
          Leave Lobby
        </button>
      </div>
    )
  }
}

const Lobby = () => {

  const {lobby, uid} = useLobby();
  
  let content = (
    // TODO spinner does not work
    <Spinner/>
  )


  if (lobby) {
    content = (
      <div className="container lobby-body">
        <div className="lobby-headerrow">
          <div className='details-wrapper'>
            <h1 className="left-align">Lobby</h1>
            <h5>Code to join: {lobby.id}</h5>
          </div>
          <div className='admin-wrapper'>
            <h5>admin</h5>
            <Profile user={lobby.admin}/>
          </div>
        </div>
        <div className="lobby-userrow">
          {lobby.players.map(player => (
            <Profile user={player} key={player.id}/>
          ))}
        </div>
        <div className='lobby-footerrow'>
          <ButtonMenu isAdmin={lobby.admin.id == uid}/>
        </div>
      </div>
    )
  }

  return (
    <div className="background background-dark-image lobby">
      {content}
    </div>
  );
};

export default Lobby;
