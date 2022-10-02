import request from '@/utils/request'

// 查询作品列表
export function examinePage(query) {
  return request({
    url: '/biz/opus/examine/page',
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










