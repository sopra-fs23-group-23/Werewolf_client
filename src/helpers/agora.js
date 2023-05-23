import AgoraRTC from "agora-rtc-sdk-ng"
import StorageManager from "./StorageManager";

const appId = '2d64cdbec0324225b28f83ed19f75397';
AgoraRTC.setLogLevel(4);
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
    users = users.filter(u => u.uid !== user.uid);
    users.push(user);
    try {
      subscribeToRemoteVideoTrack(user);
    } catch (e) {
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
  removeInnerHTML(`profile-video${isDisplay}-${user.uid}`);
  channelParameters.remoteVideoTrack.play(document.getElementById(`profile-video${isDisplay}-${user.uid}`));
  // Subscribe and play the remote video track.
}

agoraEngine.on("user-unpublished", (user, mediaType) => {
  users = users.filter(u => u.uid !== user.uid);
  let isDisplay = (document.getElementById(`profile-image-display-${user.uid}`) ? "-display" : "");
  removeInnerHTML(`profile-video${isDisplay}-${user}`);
});

export async function joinCall() {
  // Join a channel.
  await agoraEngine.join(appId, StorageManager.getLobbyId(), StorageManager.getChannelToken(), parseInt(StorageManager.getUserId()));
  // Create a local audio track from the microphone audio.
  channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  // Create a local video track from the video captured by a camera.
  channelParameters.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
  // Publish the local audio track in the channel.
  await agoraEngine.publish([channelParameters.localAudioTrack, channelParameters.localVideoTrack]);
  removeInnerHTML(`profile-video-${StorageManager.getUserId()}`);
  await channelParameters.localVideoTrack.play(document.getElementById(`profile-video-${StorageManager.getUserId()}`));
}

export async function leaveCall() {
  StorageManager.removeChannelToken();
  StorageManager.removeIsMuted();
  StorageManager.removeIsVideoEnabled();
  channelParameters.localAudioTrack.close();
  channelParameters.localVideoTrack.close();
  await agoraEngine.leave();
}

export async function toggleOwnVideo() {
  if (channelParameters.localVideoTrack && channelParameters.localVideoTrack.enabled) {
    await channelParameters.localVideoTrack.setEnabled(false);
    
    document.getElementById("disableVideo").style.transition = "none";
    document.getElementById("disableVideo").classList.remove("enabled");
    setTimeout(() => {
      document.getElementById("disableVideo").style.transition = "background-image 3s ease, border 3s";
    }, 100);

    StorageManager.setIsVideoEnabled("false");
    
    let isDisplay = (document.getElementById(`profile-video-display-${StorageManager.getUserId()}`) ? "-display" : "");
    removeInnerHTML(`profile-video${isDisplay}-${StorageManager.getUserId()}`);
  } else if (channelParameters.localVideoTrack){
    await channelParameters.localVideoTrack.setEnabled(true);

    document.getElementById("disableVideo").style.transition = "none";
    document.getElementById("disableVideo").classList.add("enabled");
    setTimeout(() => {
      document.getElementById("disableVideo").style.transition = "background-image 3s ease, border 3s";
    }, 100);
    
    StorageManager.setIsVideoEnabled("true");

    //render video
    let isDisplay = (document.getElementById(`profile-video-display-${StorageManager.getUserId()}`) ? "-display" : "");
    removeInnerHTML(`profile-video${isDisplay}-${StorageManager.getUserId()}`);
    await channelParameters.localVideoTrack.play(document.getElementById(`profile-video${isDisplay}-${StorageManager.getUserId()}`));
  }
}

export async function toggleAudio() {
  if (channelParameters.localAudioTrack.enabled) {
    channelParameters.localAudioTrack.setEnabled(false);
    
    document.getElementById("muteAudio").style.transition = "none";
    document.getElementById("muteAudio").classList.remove("enabled");
    setTimeout(() => {
      document.getElementById("muteAudio").style.transition = "background-image 3s ease, border 3s";
    }, 100);
    
    StorageManager.setIsMuted("true");
  } else {
    channelParameters.localAudioTrack.setEnabled(true);
    
    document.getElementById("muteAudio").style.transition = "none";
    document.getElementById("muteAudio").classList.add("enabled");
    setTimeout(() => {
      document.getElementById("muteAudio").style.transition = "background-image 3s ease, border 3s";
    }, 100);

    StorageManager.setIsMuted("false");
  }
}

function removeInnerHTML(elementId) {
  if (document.getElementById(elementId)){
    document.getElementById(elementId).innerHTML = "";
  }
}

export async function disableVideoNight(){
  users = [];
  try {
    if(channelParameters.localVideoTrack && channelParameters.localVideoTrack.enabled) {
      await channelParameters.localVideoTrack.setEnabled(false);
      let isDisplay = (document.getElementById(`profile-video-display-${StorageManager.getUserId()}`) ? "-display" : "");
      removeInnerHTML(`profile-video${isDisplay}-${StorageManager.getUserId()}`);
    }
  } catch (e) {
    console.error(e);
  }
}

export async function enableVideoAutomatic() {
    if(StorageManager.getIsVideoEnabled() === "true" && channelParameters.localVideoTrack) {
      await channelParameters.localVideoTrack.setEnabled(true);
      let isDisplay = (document.getElementById(`profile-video-display-${StorageManager.getUserId()}`) ? "-display" : "");
      removeInnerHTML(`profile-video${isDisplay}-${StorageManager.getUserId()}`);
      await channelParameters.localVideoTrack.play(document.getElementById(`profile-video${isDisplay}-${StorageManager.getUserId()}`));
    }
}

export async function renderVideo(userId, moveDisplay) {
  let renderedTrack = null;
  if (userId.toString() === StorageManager.getUserId() && channelParameters.localVideoTrack && channelParameters.localVideoTrack.enabled) {
    renderedTrack = channelParameters.localVideoTrack;
  } else if (users.find(user => user && user.uid && user.uid.toString() === userId.toString() && user.videoTrack)){ //(user.videoTrack && user.videoTrack.enabled) || moveDisplay !== null)
    let user = users.find(user => user && user.uid && user.uid.toString() === userId.toString());
    renderedTrack = user.videoTrack;
  }

  let isDisplay;
  if (moveDisplay == null){
    isDisplay = (document.getElementById(`profile-video-display-${userId}`) ? "-display" : "");
  } else {
    isDisplay = (moveDisplay) ? "-display" : "";
  }
  if (moveDisplay){
    removeInnerHTML(`profile-video-${userId}`);
  }
  if (renderedTrack) {
    removeInnerHTML(`profile-video${isDisplay}-${userId}`);
    await renderedTrack.play(document.getElementById(`profile-video${isDisplay}-${userId}`));
  }
}

export async function checkConnectionState(){
  if(agoraEngine.connectionState === "DISCONNECTED"){
    return true;
  }else{
      return false;
    }
}

export async function safeJoinCall() {
  setTimeout(async () => {
    if (await checkConnectionState()) {
      await joinCall();
      if (StorageManager.getIsVideoEnabled() === "false") {
        await toggleOwnVideo();
      }
      if (StorageManager.getIsMuted() === "true") {
        await toggleAudio();
      }
    } else {
      await enableVideoAutomatic();
    }
  }, 1200)
}