export default {
  namespaced: true,

  state: {
    status: 1,
    userInfo: {},
    previewData: {},
    editData: {},
    tempId: 0,
    jobId: 0,
    jobName: '',
    savePath: ''
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
    },

    UPDATE_TEMPID: (state, tempId) => {
      state.tempId = tempId
    },

    UPDATE_JOBID: (state, jobId) => {
      state.jobId = jobId
    },

    UPDATE_JOBNAME: (state, jobName) => {
      state.jobName = jobName
    },

    UPDATE_SAVEPATH: (state, savePath) => {
      state.savePath = savePath
    }
  }
}
