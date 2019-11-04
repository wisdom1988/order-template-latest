import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token, expiresIn) {
  const day = parseInt(expiresIn / 60 / 60 / 24)
  return Cookies.set(TokenKey, token, { expires: day })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setUserId(userId) {
  return Cookies.set('userId', userId)
}

export function getUserId() {
  return Cookies.get('userId')
}

export function removeUserId() {
  return Cookies.remove('userId')
}

