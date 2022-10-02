import request from '@/utils/request'

// 查询作品列表
export function listOpus(query) {
  return request({
    url: '/biz/opus/list',
    method: 'get',
    params: query
  })
}

// 查询作品详细
export function getOpus(id) {
  return request({
    url: '/biz/opus/' + id,
    method: 'get'
  })
}

// 新增作品
export function addOpus(data) {
  return request({
    url: '/biz/opus',
    method: 'post',
    data: data
  })
}

// 修改作品
export function updateOpus(data) {
  return request({
    url: '/biz/opus',
    method: 'put',
    data: data
  })
}

// 设置作品上架
export function changeSuperiorStatus(id, superior) {
  const data = {
    id,
    superior
  }
  return request({
    url: '/biz/opus/changeSuperiorStatus',
    method: 'put',
    data: data
  })
}

// 设置作品精选
export function changeSelectedStatus(id, selected) {
  const data = {
    id,
    selected
  }
  return request({
    url: '/biz/opus/changeSelectedStatus',
    method: 'put',
    data: data
  })
}

// 删除作品
export function delOpus(id) {
  return request({
    url: '/biz/opus/delete/' + id,
    method: 'get'
  })
}
