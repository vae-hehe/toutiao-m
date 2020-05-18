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
