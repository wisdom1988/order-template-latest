import axios from 'axios'
import camelCase from 'lodash/camelCase'
// import { MessageBox, Message } from 'element-ui'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken, removeToken, removeUserId } from '@/utils/auth'

function camelize(obj) {
  if (obj === null) {
    return null
  }
  if (typeof obj === 'object' && !Array.isArray(obj)) {
    const ret = {}
    Object.keys(obj).forEach((attr) => {
      Object.defineProperty(ret, camelCase(attr), {
        value: camelize(obj[attr]),
        writable: true,
        enumerable: true,
        configurable: true
      })
    })
    return ret
  }
  return Array.isArray(obj) ? obj.map(o => camelize(o)) : obj
}

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    const uploadIndex = config.url.indexOf('/v1')
    if (uploadIndex > -1) {
      config.baseURL = process.env.VUE_APP_FILE_API || ''
    }
    if (uploadIndex === -1) {
      config.withCredentials = true
      if (store.getters.token) {
        // let each request carry token
        // ['X-Token'] is a custom headers key
        // please modify it according to the actual situation
        config.headers['Authorization'] = `Bearer ${getToken()}`
      }
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = camelize(response.data)

    // if the custom code is not 0, it is judged as an error.
    if (res.code !== 0) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      if (res.code === 4001) {
        removeToken()
        removeUserId()
        location.reload()
      }

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   // to re-login
      //   MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
      //     confirmButtonText: 'Re-Login',
      //     cancelButtonText: 'Cancel',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('user/resetToken').then(() => {
      //       location.reload()
      //     })
      //   })
      // }
      return Promise.reject(res)
    } else {
      return res.data
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
