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
    console.log(users);
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
  channelParameters.remoteVideoTrack.play(document.getElementById(`profile-video-${user.uid}`));
  // Subscribe and play the remote audio track.
  if (document.getElementById(`profile-video-${user.uid}`).hasAttribute('hidden')) {
    document.getElementById(`profile-image-${user.uid}`).setAttribute('hidden', 'true');
    document.getElementById(`profile-video-${user.uid}`).removeAttribute('hidden');
  }
}

agoraEngine.on("user-unpublished", (user, mediaType) => {
  if (mediaType === "video") {
    document.getElementById(`profile-video-${user.uid}`).setAttribute('hidden', 'true');
    document.getElementById(`profile-image-${user.uid}`).removeAttribute('hidden');
  }
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
  await channelParameters.localVideoTrack.play(document.getElementById(`profile-video-${StorageManager.getUserId()}`));
  document.getElementById(`profile-image-${StorageManager.getUserId()}`).setAttribute('hidden', 'true');
  document.getElementById(`profile-video-${StorageManager.getUserId()}`).removeAttribute('hidden');
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

/*
Try one, probably delete
export function disableVideoNight() {
  try {
    if (channelParameters.localVideoTrack.enabled) {
      channelParameters.localVideoTrack.setEnabled(false);
      toggleHiddenAttribute(StorageManager.getUserId());
    }
  } catch (e) {
    console.log("Error probably occured because you aren't a werewolf.")
    console.error(e);
  }
}

export function enableVideoMorning() {
  if(StorageManager.getIsVideoEnabled() === "true" && channelParameters.localVideoTrack.disabled) {
    channelParameters.localVideoTrack.setEnabled(true);
  }
}

 */

export async function toggleOwnVideo() {
  if (channelParameters.localVideoTrack.enabled) {
    await channelParameters.localVideoTrack.setEnabled(false);
    document.getElementById("disableVideo").src = "/static/media/video-disabled.svg";
    StorageManager.setIsVideoEnabled("false");
    toggleHiddenAttribute(StorageManager.getUserId());
  } else {
    await channelParameters.localVideoTrack.setEnabled(true);
    document.getElementById("disableVideo").src = "/static/media/video-enabled.svg";
    StorageManager.setIsVideoEnabled("true");
    toggleHiddenAttribute(StorageManager.getUserId());
    await channelParameters.localVideoTrack.play(document.getElementById(`profile-video-${StorageManager.getUserId()}`));
    document.getElementById(`profile-image-${StorageManager.getUserId()}`).setAttribute('hidden', 'true');
    document.getElementById(`profile-video-${StorageManager.getUserId()}`).removeAttribute('hidden');
  }
}

export async function renderVideo(userId) {
  await toggleOwnVideo();
  await toggleOwnVideo();
}

export async function muteAudio() {
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

export function toggleHiddenAttribute(uid) {
  if (document.getElementById(`profile-image-${uid}`).hasAttribute('hidden')) {
    document.getElementById(`profile-image-${uid}`).removeAttribute('hidden');
    document.getElementById(`profile-video-${uid}`).setAttribute('hidden', 'true');
  } else {
    document.getElementById(`profile-image-${uid}`).setAttribute('hidden', 'true');
    document.getElementById(`profile-video-${uid}`).removeAttribute('hidden');
  }
}