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
  const agoraEngine = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  // Dynamically create a container in the form of a DIV element to play the remote video track.
  const remotePlayerContainer = document.createElement("div");
  // Dynamically create a container in the form of a DIV element to play the local video track.
  const localPlayerContainer = document.createElement('div');
  // Specify the ID of the DIV container. You can use the uid of the local user.
  localPlayerContainer.id = StorageManager.getUserId();
  // Set the textContent property of the local video container to the local user id.
  // Set the local video container size.

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
      // Specify the ID of the DIV container. You can use the uid of the remote user.
      remotePlayerContainer.id = user.uid.toString();
      channelParameters.remoteUid = user.uid.toString();
      // Append the remote container to the page body.
      //document.body.append(remotePlayerContainer);
      // Play the remote video track.
      channelParameters.remoteVideoTrack.play(remotePlayerContainer);
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

  async function joinCall() {
    // Join a channel.
    await agoraEngine.join(appId, StorageManager.getLobbyId(), StorageManager.getChannelToken(), StorageManager.getUserId());
    // Create a local audio track from the microphone audio.
    channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    // Create a local video track from the video captured by a camera.
    channelParameters.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    // Append the local video container to the page body.
    //document.querySelector(".lobby-userrow .lobby-profile").append(localPlayerContainer, remotePlayerContainer);
    const lobbyProfile = document.querySelector(`.lobby-userrow #lobby-profile-${StorageManager.getUserId()}`);
    lobbyProfile.append(localPlayerContainer);
    lobbyProfile.append(remotePlayerContainer);
    // lobbyProfile.insertAdjacentElement("beforeend", localPlayerContainer);
    //lobbyProfile.insertAdjacentElement("beforeend", remotePlayerContainer);
    
    //document.body.append(remotePlayerContainer);
    // Publish the local audio track in the channel.
    await agoraEngine.publish([channelParameters.localAudioTrack, channelParameters.localVideoTrack]);
    // Play the local video track.
    channelParameters.localVideoTrack.play(localPlayerContainer);
    console.log("Publish success!");
  }
  joinCall();
}