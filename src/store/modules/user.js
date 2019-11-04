import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, setUserId, getUserId } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  userId: getUserId(),
  userType: 0
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

        commit('SET_NAME', name)
        commit('SET_USERTYPE', type)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        resolve()
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

