import 'styles/views/Lobby.scss';

const Lobby = () => {
  return (
    <div className="background background-dark lobby">
      <div className="container">
        <h2 class="left-align">Get started with Voice Calling</h2>
        <div class="row">
          <div>
            <button type="button" id="join">Join</button>
            <button type="button" id="leave">Leave</button>
          </div>
        </div>
        <div id="message"></div>
      </div>
    </div>
  );
};

export default Lobby;
