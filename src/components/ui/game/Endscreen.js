

const Endscreen = ({data}) => {
    function leaveLobby() {
        // TODO
        alert("Not implemented yet");
      }
      function rematch() {
        // TODO
        alert("Not implemented yet");
      }
    return (
        <div className='container winner-body'>
        <div className='winner-headerrow'>
          <button className='btn btn-light' onClick={leaveLobby()}>leave lobby</button>
          <button className='btn btn-light' onClick={rematch()}>play again</button>
        </div>
        <div className='winner-role'>
          <h1>The {data.winner}s won the game.</h1>
          <img src={`/assets/images/roles/${data.winner}.png`} alt='Winning Team'></img>
        </div>
        <div className='winner-players'>
          <p>Display all other players here like death view, on hover the picture in winner-role should change. Also change text.</p>
        </div>
      </div>
  );
}
export default Endscreen;