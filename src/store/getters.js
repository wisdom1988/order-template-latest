const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.name,
  userType: state => state.user.userType,
  userInfo: state => state.user.userInfo
}
export default getters
