/**
 * 封装 axios 请求模块
 */

import axios from 'axios'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/' // 配置基础路径
})

// 请求拦截器

// 响应拦截器

// 导出
export default request