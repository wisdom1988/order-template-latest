import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function resetPassword(data) {
  return request({
    url: '/user/resetPassword',
    method: 'post',
    data
  })
}

export function getInfo(userId) {
  return request({
    url: '/user/info',
    method: 'post',
    params: { userId }
  })
}

export function getVerify() {
  return request({
    url: '/cap.php',
    method: 'get'
  })
}
