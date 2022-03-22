export default {
    name: 'getters',
    default: {
        getUserId(state) {
            return state.userId
        },
        getIsOldUser(state) {
            return state.isOldUser
        },
    }
}