import AgoraRTC from "agora-rtc-sdk-ng"
import StorageManager from "./StorageManager";
import { useState } from "react";


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

const Agora = () => {
    const [agoraEngine, setAgoraEngine] = useState(null);

    function startBasicCall(){
    // Create an instance of the Agora Engine
    setAgoraEngine(AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));
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
    async function joinCall() {
        await agoraEngine.join(appId, StorageManager.getLobbyId(), StorageManager.getChannelToken(), StorageManager.getUserId());
        // Create a local audio track from the microphone audio.
        channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        // Publish the local audio track in the channel.
        await agoraEngine.publish(channelParameters.localAudioTrack);
        console.log("Publish success!");
    }

    async function leaveCall(){
        // Destroy the local audio and track.
        channelParameters.localAudioTrack.close();
        // Leave the channel.
        await agoraEngine.leave();
        console.log("You left the channel");
        StorageManager.removeChannelToken();
    }
};