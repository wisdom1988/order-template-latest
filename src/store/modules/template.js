export default {
  namespaced: true,

  state: {
    status: 1,
    userInfo: {},
    previewData: {},
    editData: {}
  },

  mutations: {
    UPDATE_STATUS: (state, status) => {
      state.status = status
    },

    UPDATE_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    },

    UPDATE_PREVIEWDATA: (state, previewData) => {
      state.previewData = previewData
    },

    UPDATE_EDITDATA: (state, editData) => {
      state.editData = editData
    }
  }
}
