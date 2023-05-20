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
  showVideo(true, null, user.uid);
  let isDisplay = (document.getElementById(`profile-image-display-${user.uid}`) ? "-display" : "");
  channelParameters.remoteVideoTrack.play(document.getElementById(`profile-video${isDisplay}-${user.uid}`));
  // Subscribe and play the remote video track.
}

agoraEngine.on("user-unpublished", (user, mediaType) => {
  if (mediaType === "video") {
    showVideo(false, null, user.uid);
  }
  users = users.filter(u => u.uid !== user.uid);
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
  
  showVideo(true, false, StorageManager.getUserId());
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

export async function moveVideo(userId, renderDisplay) {
    console.log("Rerender Video of " + userId);
    
    let videoTrack = null;
    if (userId.toString() === StorageManager.getUserId()) {
      videoTrack = channelParameters.localVideoTrack;
    } else {
      try {
        let user = users.find(user => user && user.uid && user.uid.toString() === userId.toString());
        videoTrack = user.videoTrack;
      } catch (e) {
        console.log("User has no published video / is not found");
        return;
      }
    }

    let DOMElement = null;
    if (renderDisplay) {
      // If the user is displayed in Hitlist or CupidMatch
      DOMElement = document.getElementById(`profile-video-display-${userId}`);
      showVideo(true, true, userId);
      showVideo(false, false, userId);
    } else {
      // User is in selection
      DOMElement = document.getElementById(`profile-video-${userId}`);
      showVideo(true, false, userId);
    }
    await videoTrack.play(DOMElement);  
}

export function showVideo(enableVideo, isDisplay, uid) {
  if (isDisplay === null){
    isDisplay = (document.getElementById(`profile-image-display-${uid}`) ? "-display" : "");
    console.log("isDisplay was null now is: ", isDisplay)
  } else {
    console.log("isDisplay was" + isDisplay)
    isDisplay = (isDisplay) ? "-display" : "";
    console.log(" now is: ", isDisplay)

  }
  if (enableVideo) {
    document.getElementById(`profile-video${isDisplay}-${uid}`).innerHTML = ""; // remove again?
    document.getElementById(`profile-image${isDisplay}-${uid}`).setAttribute('hidden', 'true');
    document.getElementById(`profile-video${isDisplay}-${uid}`).removeAttribute('hidden');
  } else {
    document.getElementById(`profile-image${isDisplay}-${uid}`).removeAttribute('hidden');
    document.getElementById(`profile-video${isDisplay}-${uid}`).setAttribute('hidden', 'true');
  }
}

export async function toggleOwnVideo() {
  if (channelParameters.localVideoTrack && channelParameters.localVideoTrack.enabled) {
    await channelParameters.localVideoTrack.setEnabled(false);
    document.getElementById("disableVideo").src = "/static/media/video-disabled.svg";
    StorageManager.setIsVideoEnabled("false");
    showVideo(false, null, StorageManager.getUserId());
  } else if (channelParameters.localVideoTrack){
    await channelParameters.localVideoTrack.setEnabled(true);
    document.getElementById("disableVideo").src = "/static/media/video-enabled.svg";
    StorageManager.setIsVideoEnabled("true");
    showVideo(true, null, StorageManager.getUserId());
    let isDisplay = (document.getElementById(`profile-image-display-${StorageManager.getUserId()}`) ? "-display" : "");
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



export async function disableVideoNight(){
  console.log("Disable Video Night for these users (should be all)", users);
  // disable all remote videos
  users.forEach(user => {
    showVideo(false, null, user.uid);
  });
  // disable own video
  showVideo(false, null, StorageManager.getUserId());
}

export async function enableVideoMorning(){
  console.log("Enable Video Morning for these users", users);
  // enable all remote videos
  users.forEach(user => {
    showVideo(true, null, user.uid);
  });
  // enable own video
  showVideo(true, null, StorageManager.getUserId());
}