import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/'
import { Dialog } from 'vant'

// 注册路由
Vue.use(VueRouter)

// 路由规则
// 路由懒加载
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login'),
    meta: { requireAuth: false }
  },
  {
    path: '/',
    component: () => import('@/views/layout/'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/home/'),
        meta: { requireAuth: false }
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa/'),
        meta: { requireAuth: false }
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video/'),
        meta: { requireAuth: false }
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my/'),
        meta: { requireAuth: false }
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search'),
    meta: { requireAuth: false }
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article/'),
    props: true, // 将动态路由参数映射到组件中的props中
    meta: { requireAuth: false }
  },
  {
    path: '/user/profile',
    name: 'user',
    component: () => import('@/views/user-profile'),
    meta: { requireAuth: false }
  },
  {
    path: '/user/chat',
    name: 'chat',
    component: () => import('@/views/user-chat'),
    meta: { requireAuth: true } // 给路由添加额外自定义数据
  }
]

// 初始化路由
const router = new VueRouter({
  routes
})

// 导航守卫
router.beforeEach((to, from, next) => {
  // 判断自定义数据是否是真
  if (to.meta.requireAuth) {
    // 判断用户是否登录
    if (store.state.user) {
      // 已经登录
      return next()
    }
    // 校验数据, 给提示
    Dialog.confirm({
      title: '登录确认',
      message: '该功能需要登录才能访问, 您确认登录吗'
    }).then(() => {
      // 确认登录, 跳转到登录界面
      router.replace({
        name: 'login',
        query: {
          redirect: router.currentRoute.fullPath
        }
      })
    }).catch(() => {
      // 不确认
      next(false)
    })
  } else {
    next()
  }
})

export default router
