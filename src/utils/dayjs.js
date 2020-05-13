/**
 * 初始化 dayjs 相关配置
 */
import Vue from 'vue'
import dayjs from 'dayjs'
// 加载中文包
import 'dayjs/locale/zh-cn'
// 加载插件
import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用处理相对时间
dayjs.extend(relativeTime)

// 配置使用中文语言包
dayjs.locale('zh-cn')

// 把处理相对时间的代码包装成过滤器
// 在任何模板中都可以使用
// 过滤器就是可以在模板中调用的函数, 必须有返回值
Vue.filter('relativeTime', value => {
  return dayjs(value).from(dayjs())
})
