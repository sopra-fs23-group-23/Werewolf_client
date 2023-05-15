import AgoraRTC from "agora-rtc-sdk-ng"
import StorageManager from "./StorageManager";


const appId = '348d6a205d75436e916896366c5e315c';
AgoraRTC.setLogLevel(2);

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

  // Listen for the "user-published" event to retrieve an AgoraRTCRemoteUser object.
  agoraEngine.on("user-published", async (user, mediaType) => {
    // Subscribe to the remote user when the SDK triggers the "user-published" event.
    await agoraEngine.subscribe(user, mediaType);
    // Subscribe and play the remote video in the container If the remote user publishes a video track.
    if (mediaType === "video") {
      // Retrieve the remote video track.
      channelParameters.remoteVideoTrack = user.videoTrack;
      // Retrieve the remote audio track.
      channelParameters.remoteAudioTrack = user.audioTrack;
      // Save the remote user id for reuse.
      channelParameters.remoteUid = user.uid.toString();
      // Play the remote video track.
      channelParameters.remoteVideoTrack.play(document.querySelector(`#profile-video-${channelParameters.remoteUid}`));
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
  // TODO: dont just append this button to the body
  AgoraRTC.onAutoplayFailed = () => {
    const btn = document.createElement("button");
    btn.innerText = "Click me to resume the audio playback";
    btn.onClick = () => {
      btn.remove();
    };
    document.body.append(btn);
  };
  agoraEngine.on("user-unpublished", (user) => {
    console.log("user-unpublished", user.uid);

    // theoretisch chönt mer alli uids wo da drinne sind in e liste speichere und bi dene denn eif de avatar zeige?
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
  channelParameters.localVideoTrack.play(document.querySelector(`#profile-video-${StorageManager.getUserId()}`));
}

export async function leaveCall(){
  const agoraEngine = StorageManager.getAgoraEngine();
  StorageManager.removeChannelToken();
  StorageManager.removeIsMuted();
  StorageManager.removeIsVideoEnabled();
  channelParameters.localAudioTrack.close();
  channelParameters.localVideoTrack.close();
  await agoraEngine.leave();
}

export async function disableVideo() {
  if (channelParameters.localVideoTrack.enabled) {
    channelParameters.localVideoTrack.setEnabled(false);
    document.getElementById("disableVideo").src = "/static/media/video-disabled.svg";
    StorageManager.setIsVideoEnabled("false");
    var image = document.getElementById(`profile-image-${StorageManager.getUserId()}`);
    var video = document.getElementById(`profile-video-${StorageManager.getUserId()}`);
    image.setAttribute('hidden', 'false');
    video.setAttribute('hidden', 'true');
  }else{
    channelParameters.localVideoTrack.setEnabled(true);
    document.getElementById("disableVideo").src = "/static/media/video-enabled.svg";
    StorageManager.setIsVideoEnabled("true");
    var image = document.getElementById(`profile-image-${StorageManager.getUserId()}`);
    var video = document.getElementById(`profile-video-${StorageManager.getUserId()}`);
    image.setAttribute('hidden', 'true');
    video.setAttribute('hidden', 'false');
  }
}

export async function muteAudio() {
  if (channelParameters.localAudioTrack.enabled) {
    channelParameters.localAudioTrack.setEnabled(false);
    document.getElementById("muteAudio").src = "/static/media/microphone-disabled.svg";
    StorageManager.setIsMuted("true");
  }else{
    channelParameters.localAudioTrack.setEnabled(true);
    document.getElementById("muteAudio").src = "/static/media/microphone-enabled.svg";
    StorageManager.setIsMuted("false");
  }
}