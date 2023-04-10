import AgoraRTC from "agora-rtc-sdk-ng"
import StorageManager from "./StorageManager";


let options =
{
  appId: '348d6a205d75436e916896366c5e315c',
  channel: StorageManager.getLobbyId(),
  token: StorageManager.getChannelToken(),
  uid: StorageManager.getUserId(),
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

function waitForSessionStorageItem(key) {
  return new Promise(resolve => {
    const checkItem = () => {
      if (StorageManager.getLobbyId()) {
        resolve();
      }
      else {
        setTimeout(checkItem, 100);
      }
    };
    checkItem();
  });
}

export function startBasicCall() {
  // Create an instance of the Agora Engine
  const agoraEngine = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  // Listen for the "user-published" event to retrieve an AgoraRTCRemoteUser object.
  agoraEngine.on("user-published", async (user, mediaType) => {
    // Subscribe to the remote user when the SDK triggers the "user-published" event.
    await agoraEngine.subscribe(user, mediaType);
    console.log("subscribe success");

    // Subscribe and play the remote audio track.
    if (mediaType == "audio") {
      channelParameters.remoteUid = user.uid;
      // Get the RemoteAudioTrack object from the AgoraRTCRemoteUser object.
      channelParameters.remoteAudioTrack = user.audioTrack;
      // Play the remote audio track. 
      channelParameters.remoteAudioTrack.play();
    }

    // Listen for the "user-unpublished" event.
    agoraEngine.on("user-unpublished", user => {
      console.log(user.uid + "has left the channel");
    });
  });

  async function joinCall() {

      // Join a channel.
      agoraEngine.join(options.appId, options.channel, options.token, options.uid);
      // Create a local audio track from the microphone audio.
      channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      // Publish the local audio track in the channel.
      await agoraEngine.publish(channelParameters.localAudioTrack);
      console.log("Publish success!");
      


      // // Listen to the Leave button click event.
      // document.getElementById('leave-channel').onclick = async function ()
      // {
      //   // Destroy the local audio track.
      //   channelParameters.localAudioTrack.close();
      //   // Leave the channel
      //   await agoraEngine.leave();
      //   console.log("You left the channel");
      //   // Refresh the page for reuse
      //   window.location.reload();
      // }
  }
  joinCall();
}