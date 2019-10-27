import request from '@/utils/request'

// 上传图片
export function uploadImg(file) {
  const param = new FormData()
  param.append('file', file)
  return request({
    url: '/upload',
    method: 'post',
    data: param
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

// 创建新用户
export function addUser(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

// 获取工单模板列表
export function getTemplateList(params) {
  return request({
    url: '/orderTemplate/list',
    method: 'get',
    params
  })
}

// 删除工单模板
export function deleteTemplate(tempId) {
  return request({
    url: '/orderTemplate/delete',
    method: 'post',
    data: {
      tempId
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

// 获取工单列表
export function getOrderList(data) {
  return request({
    url: '/job/jobList',
    method: 'post',
    data
  })
}

// 创建工单
export function addOrder(data) {
  return request({
    url: '/job/createJob',
    method: 'post',
    data
  })
}

// 删除工单
export function deleteOrder(data) {
  return request({
    url: '/job/deleteJob',
    method: 'post',
    data
  })
}
