import AgoraRTC from "agora-rtc-sdk-ng"
import StorageManager from "./StorageManager";


const appId = '348d6a205d75436e916896366c5e315c';


let channelParameters =
{
  // A variable to hold a local audio track.
  localAudioTrack: null,
  // A variable to hold a remote audio track.
  remoteAudioTrack: null,
  // A variable to hold the remote user id.
  remoteUid: null,
};

export function startBasicCall() {
  // Create an instance of the Agora Engine
  const agoraEngine = StorageManager.getAgoraEngine();

  // Listen for the "user-published" event to retrieve an AgoraRTCRemoteUser object.
  agoraEngine.on("user-published", async (user, mediaType) => {
    // Subscribe to the remote user when the SDK triggers the "user-published" event.
    await agoraEngine.subscribe(user, mediaType);
    console.log("subscribe success");
    // Subscribe and play the remote audio track.
    if (mediaType === "audio") {
      channelParameters.remoteUid = user.uid;
      // Get the RemoteAudioTrack object from the AgoraRTCRemoteUser object.
      channelParameters.remoteAudioTrack = user.audioTrack;
      // Play the remote audio track. 
      channelParameters.remoteAudioTrack.play();
    };
  });
}

export async function joinCall() {
  const agoraEngine = StorageManager.getAgoraEngine();
  // Join a channel.
  await agoraEngine.join(appId, StorageManager.getLobbyId(), StorageManager.getChannelToken(), StorageManager.getUserId());
  // Create a local audio track from the microphone audio.
  channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  // Publish the local audio track in the channel.
  await agoraEngine.publish(channelParameters.localAudioTrack);
  console.log("Publish success!");
}

export async function leaveCall(){
  const agoraEngine = StorageManager.getAgoraEngine();
  channelParameters.localAudioTrack.close();
  await agoraEngine.leave();
  console.log("You left the channel");
  StorageManager.removeChannelToken();
}

// export function changeMicrophone() {
//   var microphoneTracks = AgoraRTC.getMicrophones();
//   console.log("microphoneTracks", microphoneTracks);

// var microphoneTracks = await AgoraRTC.getMicrophones();
// var playbackDevices = await AgoraRTC.getPlaybackDevices();

// console.log("microphoneTracks", microphoneTracks);
// console.log("playbackDevices", playbackDevices);

// }

export async function muteAudio() {
  if (StorageManager.getIsMuted() === "false") {
    channelParameters.localAudioTrack.setEnabled(false);
    document.getElementById("muteAudio").src = "/static/media/microphone-disabled.svg";
    StorageManager.setIsMuted("true");
  }else{
    channelParameters.localAudioTrack.setEnabled(true);
    document.getElementById("muteAudio").src = "/static/media/microphone-enabled.svg";
    StorageManager.setIsMuted("false");
  }
}