import request from '@/utils/request'

// 查询作品列表
export function commentPage(query) {
  return request({
    url: '/biz/opus/comment/pageList',
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
export function updateState(id){
  return request({
    url: '/biz/opus/examine/data/' + id,
    method: 'get'
  })

}

// 作品评论显示与不显示
export function changeViewStatus(id, view) {
  const data = {
    id,
    view
  }
  return request({
    url: '/biz/opus/comment/changeViewStatus',
    method: 'post',
    data: data
  })
}

export function getDetailPage(query){
  return request({
    url: '/biz/opus/comment/getDetailPage/',
    method: 'get',
    params: query
  })

}

export function deleteComment(id) {
  return request({
    url: '/biz/opus/comment/delete/' + id,
    method: 'get'
  })
}

