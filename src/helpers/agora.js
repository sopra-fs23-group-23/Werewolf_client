import AgoraRTC from "agora-rtc-sdk-ng"

const {RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole} = require('agora-access-token')


//Miro options:
let options = 
{
    appId: '348d6a205d75436e916896366c5e315c',
    channel: 'Werewolves',
    token: '007eJxTYGA/Utp6z/rSsi1fTD8tVuWUVL51pLjmyr8r0sK3Ht1sDn6mwGBsYpFilmhkYJpibmpibJZqaWhmYWlmbGaWbJpqbGiavLdZI6UhkJHhZWQaCyMDBIL4XAzhqUWp5fk5ZanFDAwApDojZA==',
    uid: 0,
};


//David options:
/*
let options = 
{
    appId: '2d64cdbec0324225b28f83ed19f75397',
    channel: 'Werewolves',
    token: '8214500e1ebd4e10bcd411dd4df44395',
    uid: 0,
};
*/

const appId = '348d6a205d75436e916896366c5e315c';
const appCertificate = '2e1e585ed3f74218ae249f7d14656fe2';
const channelName = 'TestChannel';
const uid = 0;
const role = RtcRole.PUBLISHER;
const expirationTimeInSeconds = 3600
const currentTimestamp = Math.floor(Date.now() / 1000)
const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
// Build token with uid
const tokenA = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs);
console.log("Token with integer number Uid: " + tokenA);


let channelParameters =
{
  // A variable to hold a local audio track.
  localAudioTrack: null,
  // A variable to hold a remote audio track.
  remoteAudioTrack: null,
    // A variable to hold the remote user id.
  remoteUid: null,
};
export async function startBasicCall()
{
  // Create an instance of the Agora Engine
  const agoraEngine = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  
  // Listen for the "user-published" event to retrieve an AgoraRTCRemoteUser object.
  agoraEngine.on("user-published", async (user, mediaType) =>
  {
    // Subscribe to the remote user when the SDK triggers the "user-published" event.
    await agoraEngine.subscribe(user, mediaType);
    console.log("subscribe success");

    // Subscribe and play the remote audio track.
    if (mediaType == "audio")
    {
      channelParameters.remoteUid=user.uid;
      // Get the RemoteAudioTrack object from the AgoraRTCRemoteUser object.
      channelParameters.remoteAudioTrack = user.audioTrack;
      // Play the remote audio track. 
      channelParameters.remoteAudioTrack.play();
      showMessage("Remote user connected: " + user.uid);
    }

    // Listen for the "user-unpublished" event.
    agoraEngine.on("user-unpublished", user =>
    {
      console.log(user.uid + "has left the channel");
      showMessage("Remote user has left the channel");
    });
  });

  window.onload = function ()
  {
    // Listen to the Join button click event.
    document.getElementById("join-channel").onclick = async function ()
    {
      // Join a channel.
      await agoraEngine.join(options.appId, options.channel, options.token, options.uid);
      showMessage("Joined channel: " + options.channel);
      // Create a local audio track from the microphone audio.
      channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      // Publish the local audio track in the channel.
      await agoraEngine.publish(channelParameters.localAudioTrack);
      console.log("Publish success!");
    }
    
    // Listen to the Leave button click event.
    document.getElementById('leave-channel').onclick = async function ()
    {
      // Destroy the local audio track.
      channelParameters.localAudioTrack.close();
      // Leave the channel
      await agoraEngine.leave();
      console.log("You left the channel");
      // Refresh the page for reuse
      window.location.reload();
    }
  }
}

function showMessage(text){
  document.getElementById("message").textContent = text;
}

startBasicCall();