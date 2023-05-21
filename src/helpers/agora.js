import AgoraRTC from "agora-rtc-sdk-ng"
import StorageManager from "./StorageManager";

const appId = '348d6a205d75436e916896366c5e315c';
AgoraRTC.setLogLevel(2);
var users = [];

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

const agoraEngine = StorageManager.getAgoraEngine();

agoraEngine.on("user-published", async (user, mediaType) => {
  // Subscribe to the remote user when the SDK triggers the "user-published" event.
  await agoraEngine.subscribe(user, mediaType);
  if (mediaType === "audio") {
    channelParameters.remoteUid = user.uid;
    // Get the RemoteAudioTrack object from the AgoraRTCRemoteUser object.
    channelParameters.remoteAudioTrack = user.audioTrack;
    // Play the remote audio track.
    channelParameters.remoteAudioTrack.play();
  } else if (mediaType === "video") {
    users.push(user);
    console.log("All remote users:", users);
    try {
      subscribeToRemoteVideoTrack(user);
    } catch (e) {
      //TODO remove this error, only logged for development purposes
      console.error(e);
      setTimeout(function() {subscribeToRemoteVideoTrack(user)}, 2000);
    }
  }
});

export function subscribeToRemoteVideoTrack (user) {
  // Subscribe and play the remote video in the container If the remote user publishes a video track.
  // Retrieve the remote video track.
  channelParameters.remoteVideoTrack = user.videoTrack;
  // Retrieve the remote audio track.
  channelParameters.remoteAudioTrack = user.audioTrack;
  // Save the remote user id for reuse.
  channelParameters.remoteUid = user.uid.toString();
  // Play the remote video track.
  let isDisplay = (document.getElementById(`profile-video-display-${user.uid}`) ? "-display" : "");
  document.getElementById(`profile-video${isDisplay}-${user.uid}`).innerHTML = "";
  channelParameters.remoteVideoTrack.play(document.getElementById(`profile-video${isDisplay}-${user.uid}`));
  // Subscribe and play the remote video track.
}

agoraEngine.on("user-unpublished", (user, mediaType) => {
  users = users.filter(u => u.uid !== user.uid);
  let isDisplay = (document.getElementById(`profile-image-display-${user.uid}`) ? "-display" : "");
  document.getElementById(`profile-video${isDisplay}-${user}`).innerHTML = "";
});

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
  //showVideo(true, false, StorageManager.getUserId());
  await channelParameters.localVideoTrack.play(document.getElementById(`profile-video-${StorageManager.getUserId()}`));
}

export async function leaveCall() {
  const agoraEngine = StorageManager.getAgoraEngine();
  StorageManager.removeChannelToken();
  StorageManager.removeIsMuted();
  StorageManager.removeIsVideoEnabled();
  channelParameters.localAudioTrack.close();
  channelParameters.localVideoTrack.close();
  await agoraEngine.leave();
}

// export async function moveVideo(userId, renderDisplay) {   
//     let videoTrack = null;
//     if (userId.toString() === StorageManager.getUserId() && channelParameters.localVideoTrack && channelParameters.localVideoTrack.enabled) {
//       videoTrack = channelParameters.localVideoTrack;
//     } else if (users.find(user => user && user.uid && user.uid.toString() === userId.toString())){
//       let user = users.find(user => user && user.uid && user.uid.toString() === userId.toString());
//       videoTrack = user.videoTrack;
//     } else {
//       console.log("User has no published video / is not found");
//       return;
//     }
//     let isDisplay = (renderDisplay) ? "-display" : "";
//     document.getElementById(`profile-video${isDisplay}-${userId}`).innerHTML = "";
//     await videoTrack.play(document.getElementById(`profile-video${isDisplay}-${userId}`));
// }

export async function toggleOwnVideo() {
  if (channelParameters.localVideoTrack && channelParameters.localVideoTrack.enabled) {
    await channelParameters.localVideoTrack.setEnabled(false);
    document.getElementById("disableVideo").src = "/static/media/video-disabled.svg";
    StorageManager.setIsVideoEnabled("false");
    let isDisplay = (document.getElementById(`profile-video-display-${StorageManager.getUserId()}`) ? "-display" : "");
    document.getElementById(`profile-video${isDisplay}-${StorageManager.getUserId()}`).innerHTML = "";
  } else if (channelParameters.localVideoTrack){
    await channelParameters.localVideoTrack.setEnabled(true);
    document.getElementById("disableVideo").src = "/static/media/video-enabled.svg";
    StorageManager.setIsVideoEnabled("true");

    //render video
    let isDisplay = (document.getElementById(`profile-video-display-${StorageManager.getUserId()}`) ? "-display" : "");
    document.getElementById(`profile-video${isDisplay}-${StorageManager.getUserId()}`).innerHTML = "";
    await channelParameters.localVideoTrack.play(document.getElementById(`profile-video${isDisplay}-${StorageManager.getUserId()}`));
  }
}

export async function toggleAudio() {
  if (channelParameters.localAudioTrack.enabled) {
    channelParameters.localAudioTrack.setEnabled(false);
    document.getElementById("muteAudio").src = "/static/media/microphone-disabled.svg";
    StorageManager.setIsMuted("true");
  } else {
    channelParameters.localAudioTrack.setEnabled(true);
    document.getElementById("muteAudio").src = "/static/media/microphone-enabled.svg";
    StorageManager.setIsMuted("false");
  }
}

export async function renderVideo(userId, moveDisplay) {
  let renderedTrack = null;
  if (userId.toString() === StorageManager.getUserId() && channelParameters.localVideoTrack && channelParameters.localVideoTrack.enabled) {
    renderedTrack = channelParameters.localVideoTrack;
  } else if (users.find(user => user && user.uid && user.uid.toString() === userId.toString())){
    let user = users.find(user => user && user.uid && user.uid.toString() === userId.toString());
    renderedTrack = user.videoTrack;
  }

  let isDisplay;
  if (moveDisplay == null){
    isDisplay = (document.getElementById(`profile-video-display-${userId}`) ? "-display" : "");
  } else {
    isDisplay = (moveDisplay) ? "-display" : "";
  }

  if (renderedTrack) {
    let isDisplay = (document.getElementById(`profile-video-display-${userId}`) ? "-display" : "");
    document.getElementById(`profile-video${isDisplay}-${userId}`).innerHTML = "";
    await renderedTrack.play(document.getElementById(`profile-video${isDisplay}-${userId}`));
  }
  if (moveDisplay){
    document.getElementById(`profile-video-${userId}`).innerHTML = "";
  }
}
