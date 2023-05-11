import AgoraRTC from "agora-rtc-sdk-ng"
import StorageManager from "./StorageManager";


const appId = '348d6a205d75436e916896366c5e315c';


let channelParameters =
{
  // A variable to hold a local audio track.
  localAudioTrack: null,
  // A variable to hold a remote audio track.
  remoteAudioTrack: null,
  // A variable to hold a local video track.
  localVideoTrack: null,
  // A variable to hold a remote video track.
  remoteVideoTrack: null,
  // A variable to hold the remote user id.
  remoteUid: null,
};


export function startBasicCall() {
  // Create an instance of the Agora Engine
  const agoraEngine = StorageManager.getAgoraEngine();
  AgoraRTC.setLogLevel(2);
  // Listen for the "user-published" event to retrieve an AgoraRTCRemoteUser object.
  agoraEngine.on("user-published", async (user, mediaType) => {
    // Subscribe to the remote user when the SDK triggers the "user-published" event.
    await agoraEngine.subscribe(user, mediaType);
    console.log("subscribe success");
    // Subscribe and play the remote video in the container If the remote user publishes a video track.
    if (mediaType === "video") {
      console.log("Starting video conference");
      // Retrieve the remote video track.
      channelParameters.remoteVideoTrack = user.videoTrack;
      // Retrieve the remote audio track.
      channelParameters.remoteAudioTrack = user.audioTrack;
      // Save the remote user id for reuse.
      channelParameters.remoteUid = user.uid.toString();
      // Play the remote video track.
      channelParameters.remoteVideoTrack.play(`profile-video-${channelParameters.remoteUid}`);
    }
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
  await agoraEngine.join(appId, StorageManager.getLobbyId(), StorageManager.getChannelToken(), parseInt(StorageManager.getUserId()));
  // Create a local audio track from the microphone audio.
  channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  // Create a local video track from the video captured by a camera.
  channelParameters.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
  // Publish the local audio track in the channel.
  await agoraEngine.publish([channelParameters.localAudioTrack, channelParameters.localVideoTrack]);
  channelParameters.localVideoTrack.play(`profile-video-${StorageManager.getUserId()}`);
  channelParameters.localVideoTrack.play(`profile-video-${StorageManager.getUserId()}-dup`);
}

export async function leaveCall(){
  const agoraEngine = StorageManager.getAgoraEngine();
  channelParameters.localAudioTrack.close();
  await agoraEngine.leave();
}


// export async function checkIfUserIsInCall() {
//   const agoraEngine = StorageManager.getAgoraEngine();
//   const remoteUsers = agoraEngine.remoteUsers;
//   console.log("remoteUsers", remoteUsers);
//   if (remoteUsers.length > 0) {
//     console.log("You are in a call");
//     return true;
//   } else {
//     console.log("You are not in a call");
//     return false;
//   }
// }

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