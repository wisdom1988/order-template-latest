export default {
  namespaced: true,

  state: {
    status: 1,
    userInfo: {}
  },

  mutations: {
    UPDATE_STATUS: (state, status) => {
      state.status = status
    },

    UPDATE_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    }
  }
}
