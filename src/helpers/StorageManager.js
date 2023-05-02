import AgoraRTC from "agora-rtc-sdk-ng";

class StorageManager {
    static agoraEngine = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    static getUserToken() {
        return sessionStorage.getItem("token")
    }

    static getUserId() {
        return sessionStorage.getItem("uid")
    }

    static getLobbyId() {
        return sessionStorage.getItem("lobbyId")
    }

    static getChannelToken() {
        return sessionStorage.getItem("channelToken")
    }

    static getAgoraEngine() {
        return this.agoraEngine;
    }

    static getIsMuted() {
        return sessionStorage.getItem("isMuted")
    }

    static setUserToken(token) {
        sessionStorage.setItem("token", token)
    }

    static setUserId(uid) {
        sessionStorage.setItem("uid", uid)
    }

    static setLobbyId(lobbyId) {
        sessionStorage.setItem("lobbyId", lobbyId)
    }

    static setChannelToken(channelToken) {
        sessionStorage.setItem("channelToken", channelToken)
    }

    static setIsMuted(isMuted) {
        sessionStorage.setItem("isMuted", isMuted)
    }

    static removeUserToken() {
        sessionStorage.removeItem('token');
    }

    static removeUserId() {
        sessionStorage.removeItem('uid');
    }

    static removeLobbyId() {
        sessionStorage.removeItem('lobbyId');
    }

    static removeChannelToken() {
        sessionStorage.removeItem('channelToken');
    }

    static removeIsMuted() {
        sessionStorage.removeItem('isMuted');
    }

    static removeAgoraEngine() {
        this.agoraEngine = null;
    }
}

export default StorageManager