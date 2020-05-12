/**
 * 封装 axios 请求模块
 */

import axios from 'axios'

import store from '@/state/'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/' // 配置基础路径
})

// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(function (config) {
  const { user } = store.state

  // 如果用户已经登录,就统一给接口设置token
  // 判断用户是不是已经登录了
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // Do something before request is sent
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 响应拦截器

// 导出
export default request
