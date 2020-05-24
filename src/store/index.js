import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

const USER_KEY = 'toutiao-user'

export default new Vuex.Store({
  state: {
    user: getItem(USER_KEY), // 当前登录用户的登录状态(token 等数据)

    // 设置缓存条件
    cachePages: ['LayoutIndex']
  },
  mutations: {
    setUser (state, data) {
      state.user = data

      // 为了防止页面刷新数据丢失, 把数据放到本地存储中, 仅仅是为了数据持久化
      setItem(USER_KEY, state.user)
    },

    // 判断有没有缓存页面, 有就删除, 没有就添加

    addCachePages (state, pageName) {
      if (!state.cachePages.includes(pageName)) {
        state.cachePages.push(pageName)
      }
    },

    removeCachePages (state, pageName) {
      const index = state.cachePages.indexOf(pageName)
      if (index !== -1) {
        state.cachePages.splice(index, 1)
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
