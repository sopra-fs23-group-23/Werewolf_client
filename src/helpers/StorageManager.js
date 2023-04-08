class StorageManager {
    static getUserToken() {
        return sessionStorage.getItem("token")
    }

    static getUserId() {
        return sessionStorage.getItem("uid")
    }

    static getLobbyId() {
        return sessionStorage.getItem("lobbyId")
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

    static removeUserToken(token) {
        sessionStorage.removeItem('token');
    }

    static removeUserId(uid) {
        sessionStorage.removeItem('uid');
    }

    static removeLobbyId(lobbyId) {
        sessionStorage.removeItem('lobbyId');
    }


}

export default StorageManager