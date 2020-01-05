import { login, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, setUserId, getUserId } from '@/utils/auth'

const state = {
  token: getToken(),
  name: '',
  userId: getUserId(),
  userType: 0,
  userInfo: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_USERTYPE: (state, userType) => {
    state.userType = userType
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(data => {
        commit('SET_TOKEN', data.accessToken)
        setToken(data.accessToken, data.expiresIn)
        commit('SET_USERID', data.userId)
        setUserId(data.userId)
        commit('SET_USERTYPE', data.userType)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.userId).then(data => {
        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { name, type } = data
        if (data.type === 2) {
          data.parent = data.parent && data.parent.name
        } else {
          data.child = data.child && String(Object.values(data.child))
        }
        commit('SET_NAME', name)
        commit('SET_USERTYPE', type)
        commit('SET_USERINFO', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

