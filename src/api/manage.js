import request from '@/utils/request'

// 上传图片
export function uploadImg(file) {
  return request({
    url: '/upload',
    method: 'post',
    data: { file }
  })
}

// 获取用户列表
export function getUserList(data) {
  return request({
    url: '/user/list',
    method: 'post',
    data
  })
}

// 获取模板工单列表
export function getTemplateList(params) {
  return request({
    url: '/orderTemplate/list',
    method: 'get',
    params
  })
}

// 删除工单模板
export function deleteTemplate(id) {
  return request({
    url: '/orderTemplate/delete',
    method: 'post',
    data: {
      temp_id: id
    }
  })
}

// 增加工单模板
export function addTemplate(data) {
  return request({
    url: '/orderTemplate/create',
    method: 'post',
    data
  })
}

// 编辑工单模板
export function editTemplate(data) {
  return request({
    url: '/orderTemplate/edit',
    method: 'post',
    data
  })
}

// 工单模板绑定图片
export function templateBindImg(temp_id, icon) {
  return request({
    url: '/orderTemplate/setIcon',
    method: 'post',
    data: {
      temp_id,
      icon
    }
  })
}
