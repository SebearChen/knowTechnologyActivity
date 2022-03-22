export default {
    name: 'actions',
    default: {
        setUserId (context, payload){
            context.commit('setUserId', payload);
        },
        getIsOldUser({
            commit
        }) {
            return new Promise((resolve, reject) => {
                getIsOldUserId().then(res => {
                    const {
                        status,
                        data
                    } = res;
                    if (status == 200) {
                        commit("setIsOldUser", data);
                    }
                    resolve(data)
                }).catch(err => {
                    reject(err)
                })
            })
        },

    }
}