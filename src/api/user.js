import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
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

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
