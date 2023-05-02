import AgoraRTC from "agora-rtc-sdk-ng"
import StorageManager from "./StorageManager";


const appId = '348d6a205d75436e916896366c5e315c';


var isMuteAudio = false;

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
  const agoraEngine = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
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
  return agoraEngine;
}

export async function joinCall(agoraEngine) {
    // Join a channel.
    await agoraEngine.join(appId, StorageManager.getLobbyId(), StorageManager.getChannelToken(), StorageManager.getUserId());
    // Create a local audio track from the microphone audio.
    channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    // Publish the local audio track in the channel.
    await agoraEngine.publish(channelParameters.localAudioTrack);
    console.log("Publish success!");
}
  // async function leaveCall() {
  //   // Destroy the local audio and track.
  //   channelParameters.localAudioTrack.close();
  //   // Leave the channel.
  //   await agoraEngine.leave();
  //   console.log("You left the channel");
  //   StorageManager.removeChannelToken();
  // }


export async function leaveCall(){
  channelParameters.localAudioTrack.close();
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
  if (isMuteAudio === false) {
    channelParameters.localAudioTrack.setEnabled(false);
    document.getElementById("muteAudio").src = "../assets/images/icons/microphone-disabled.svg";
    isMuteAudio = true;
  }else{
    channelParameters.localAudioTrack.setEnabled(true);
    document.getElementById("muteAudio").src = "../assets/images/icons/microphone-enabled.svg";
    isMuteAudio = false;
  }
}