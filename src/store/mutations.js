export default {
    name: 'mutations',
    default: {
        setSubmitData(state, obj) {
            state.submitData = Object.assign({}, state.submitData, obj)
        },
        setUserId(state, val) {
            state.userId = val
        },
        setIsOldUser(state, val) {
            state.isOldUser = val
        },
        setA(state,val){
            state.a=val;
        }
    }
}
