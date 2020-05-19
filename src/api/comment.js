/**
 * 评论相关接口
 */

import request from '@/utils/request'

// 获取评论列表
export const getCommentList = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/comments',
    params
  })
}

// 评论/回复点赞
export const getCommentLike = commentId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comment/likings',
    data: {
      target: commentId
    }
  })
}

export const deleteCommentLike = commentId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/comment/likings/${commentId}`
  })
}

// 添加评论或评论回复
export const addComment = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comments',
    data
  })
}
