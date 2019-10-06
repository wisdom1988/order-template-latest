import Mock from 'mockjs'

const data = Mock.mock({
  'list|30': [{
    userId: '@increment',
    title: '@sentence(10, 20)',
    'status|1': ['published', 'draft', 'deleted'],
    name: '@cname',
    email: '@email',
    password: '@string(7, 10)',
    'type|1': [1, 0],
    allow_capacity: '@float(0, 10, 2, 2)',
    'is_enabled|1': [1, 0],
    create_time: '@datetime',
    update_time: '@datetime'
  }]
})

export default [
  {
    url: '/user/list',
    type: 'post',
    response: config => {
      const { currentPage } = config.body
      const list = data.list
      return {
        code: 0,
        data: {
          total: list.length,
          list: list.slice((currentPage - 1) * 10, currentPage * 10)
        }
      }
    }
  }
]
