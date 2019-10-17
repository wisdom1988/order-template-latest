
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin': {
    // roles: ['admin'],
    // introduction: 'I am a super administrator',
    // avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    // name: 'Super Admin'
    user_id: 1,
    access_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xMjcuMC4wLjFcL2xvZ2luIiwiaWF0IjoxNTY3NTE1NTAxLCJleHAiOjE1Njc1MTkxMDEsIm5iZiI6MTU2NzUxNTUwMSwianRpIjoiNUMxOHVRWEJSRFBPWE1BViIsInN1YiI6MTAwMCwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.WMPfRZLmvkdA0D4Ugg02LVj_G6lems5wrPneroF0P6Y',
    expires_in: '1571371200',
    user_type: 1
  },
  'editor': {
    user_id: 1,
    access_token: 'byJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xMjcuMC4wLjFcL2xvZ2luIiwiaWF0IjoxNTY3NTE1NTAxLCJleHAiOjE1Njc1MTkxMDEsIm5iZiI6MTU2NzUxNTUwMSwianRpIjoiNUMxOHVRWEJSRFBPWE1BViIsInN1YiI6MTAwMCwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.WMPfRZLmvkdA0D4Ugg02LVj_G6lems5wrPneroF0P6Y',
    expires_in: '1571371200',
    user_type: 0
    // roles: ['editor'],
    // introduction: 'I am an editor',
    // avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    // name: 'Normal Editor'
  }
}

export default [
  // user login
  {
    url: '/login',
    type: 'post',
    response: config => {
      const { name } = config.body
      const token = tokens[name]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 0,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 0,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 0,
        data: 'success'
      }
    }
  }
]
