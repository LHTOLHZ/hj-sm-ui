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
export function changeViewStatus(commentCode, view) {
  const data = {
    commentCode,
    view
  }
  return request({
    url: '/biz/opus/comment/changeViewStatus',
    method: 'post',
    data: data
  })
}



export function deleteComment(commentCode) {
  return request({
    url: '/biz/opus/comment/delete/' + commentCode,
    method: 'get'
  })
}


//获取查看评论详情信息列表信息
export function getDetailPage(query){
  return request({
    url: '/biz/opus/comment/getDetailPage/',
    method: 'get',
    params: query
  })

}

//获取查看评论详情信息单个主体
export function getCommentInfo(id){
  return request({
    url: '/biz/opus/comment/getInfo/' + id,
    method: 'get'
  })
}

//获取当前登陆人信息
export function getLogUserInfo(){
  return request({
    url: '/biz/opus/comment/getLoginUserInfo',
    method: 'get'
  })
}

// 提交评论信息、
export function infoSubmit(id,remark){
  const data = {
    id,
    remark
  }
  return request({
    url: '/biz/opus/comment/infoSubmit',
    method: 'post',
    data: data
  })
}







