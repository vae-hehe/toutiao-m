/**
 * 封装 axios 请求模块
 */

import axios from 'axios'

import store from '@/store/'

import JSONBig from 'json-bigint'

import { Toast } from 'vant'

import router from '@/utils/request'

const redirectAuhReq = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
})

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 配置基础路径
  transformResponse: [function (data) {
    try {
      return JSONBig.parse(data)
    } catch (err) {
      console.log('转换失败', err)
      return data
    }
  }]
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
request.interceptors.response.use(function (response) {
  // 所有的成功响应进入这里
  return response
}, async function (error) {
  // 所有的不是300的状态码进入这里
  const status = error.response.status
  if (status === 400) {
    Toast.fail('客户端参数错误')
  } else if (status === 401) {
    // token失效
    const { user } = store.state
    // 判断是否有 user 或者 user.token, 没有直接登录
    if (!user || !user.token) {
      return redirectLogin()
    }

    try {
      // 判断是否有 refresh_token, 有就请求获取新的 token
      if (user.refresh_token) {
        const { data } = await redirectAuhReq({
          method: 'PUT',
          url: '/app/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${user.refresh_token}`
          }
        })
        // 将新的 token 放到容器中
        user.token = data.data.token
        // 操作 store 只能使用 mutations 操作
        store.commit('setUser', user)

        // 将失败的请求重新发送
        return request(error.config)
      }
    } catch (err) {
      // 刷新token失败, 跳转登录
      redirectLogin()
    }
  } else if (status === 403) {
    Toast.fail('没有权限')
  } else if (status >= 500) {
    Toast.fail('服务端参数错误')
  }
})

function redirectLogin () {
  router.replace({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

// 导出
export default request
