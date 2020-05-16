/**
 * 文章相关接口
 */

import request from '@/utils/request'

// 频道新闻推荐
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params
  })
}
