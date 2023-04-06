import 'styles/views/Lobby.scss';
import AgoraRTC from "agora-rtc-sdk-ng"

let options = 
{
    // Pass your App ID here.
    appId: '348d6a205d75436e916896366c5e315c',
    // Set the channel name.
    channel: 'Werewolves',
    // Pass your temp token here.
    token: '007eJxTYGA/Utp6z/rSsi1fTD8tVuWUVL51pLjmyr8r0sK3Ht1sDn6mwGBsYpFilmhkYJpibmpibJZqaWhmYWlmbGaWbJpqbGiavLdZI6UhkJHhZWQaCyMDBIL4XAzhqUWp5fk5ZanFDAwApDojZA==',
    // Set the user ID.
    uid: 0,
};

let channelParameters =
{
  // A variable to hold a local audio track.
  localAudioTrack: null,
  // A variable to hold a remote audio track.
  remoteAudioTrack: null,
    // A variable to hold the remote user id.
  remoteUid: null,
};
async function startBasicCall()
{
  // Create an instance of the Agora Engine
  const agoraEngine = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  
  // Listen for the "user-published" event to retrieve an AgoraRTCRemoteUser object.
  agoraEngine.on("user-published", async (user, mediaType) =>
  {
    // Subscribe to the remote user when the SDK triggers the "user-published" event.
    await agoraEngine.subscribe(user, mediaType);
    console.log("subscribe success");

    // Subscribe and play the remote audio track.
    if (mediaType == "audio")
    {
      channelParameters.remoteUid=user.uid;
      // Get the RemoteAudioTrack object from the AgoraRTCRemoteUser object.
      channelParameters.remoteAudioTrack = user.audioTrack;
      // Play the remote audio track. 
      channelParameters.remoteAudioTrack.play();
      showMessage("Remote user connected: " + user.uid);
    }

    // Listen for the "user-unpublished" event.
    agoraEngine.on("user-unpublished", user =>
    {
      console.log(user.uid + "has left the channel");
      showMessage("Remote user has left the channel");
    });
  });

  window.onload = function ()
  {
    // Listen to the Join button click event.
    document.getElementById("join").onclick = async function ()
    {
      // Join a channel.
      await agoraEngine.join(options.appId, options.channel, options.token, options.uid);
      showMessage("Joined channel: " + options.channel);
      // Create a local audio track from the microphone audio.
      channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      // Publish the local audio track in the channel.
      await agoraEngine.publish(channelParameters.localAudioTrack);
      console.log("Publish success!");
    }
    
    // Listen to the Leave button click event.
    document.getElementById('leave').onclick = async function ()
    {
      // Destroy the local audio track.
      channelParameters.localAudioTrack.close();
      // Leave the channel
      await agoraEngine.leave();
      console.log("You left the channel");
      // Refresh the page for reuse
      window.location.reload();
    }
  }
}

function showMessage(text){
  document.getElementById("message").textContent = text;
}

startBasicCall();

const AgoraTest = () => {
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

export default AgoraTest;
