import Mock from 'mockjs'

const Random = Mock.Random

const userData = Mock.mock({
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

const templateData = Mock.mock({
  'list|4': [{
    temp_id: '@id',
    title: '@cname',
    'icon|1': [Random.dataImage('100x100', 'Hello Mock.js!'), ''],
    'params|10': [{
      name: '@cname',
      'show_type|1': [1, 2],
      'type|1': [1, 2, 3],
      'nameLength|1-12': 12,
      'contentLength|1-12': 12,
      'row|1-6': 6,
      'col|1-12': 12
    }]
  }]
})

export default [
  {
    url: '/user/list',
    type: 'post',
    response: config => {
      const { currentPage } = config.body
      const list = userData.list
      return {
        code: 0,
        data: {
          total: list.length,
          list: list.slice((currentPage - 1) * 10, currentPage * 10)
        }
      }
    }
  },
  {
    url: '/template/list',
    type: 'get',
    response: config => {
      const list = templateData.list
      return {
        code: 0,
        data: list
      }
    }
  }
]
