<template>
<div class="home-container">
  <!-- 导航栏 -->
  <van-nav-bar class="app-nav-bar">
    <!-- 路由导航, 单页面建议使用to -->
    <van-button
      class="search-btn"
      slot="title"
      icon="search"
      type="info"
      round
      size="mini"
      to="/search"
    > 搜索
    </van-button>
  </van-nav-bar>
  <!-- /导航栏 -->

  <!-- 文章频道列表 -->
  <van-tabs class="tab-item" v-model="active">
    <van-tab v-for="channel in channels" :key="channel.id" :title="channel.name">
      <!-- 文章列表 -->
      <article-list :channel="channel"></article-list>
      <!-- /文章列表 -->
    </van-tab>
    <!-- 汉堡按钮把列表最后的位置挡住了, 解决办法就是在这里添加一个占位元素 -->
    <!-- 具名插槽可以有多个 -->
    <div class="wap-nav-placeholder" slot="nav-right"></div>
    <div slot="nav-right" @click="isChannelEditShow = true" class="wap-nav-wrap">
      <van-icon name="wap-nav" />
    </div>
  </van-tabs>
  <!-- /文章频道列表 -->
  <!-- 弹出层 -->
  <van-popup
    v-model="isChannelEditShow"
    position="bottom"
    class="channel-edit-popup"
    closeable
    close-icon-position="top-right"
    get-container="body"
    style="height:100%"
  >
  <!-- 把内容封装成组件 -->
  <!-- 父组件--频道列表传给子组件 -->
  <!-- 子组件和父组件之间的通信, 子组件传递数据, 父组件自定义事件 -->
  <!-- 通过激活active, 改变频道的切换 -->
  <!-- 模板中的$event 事件参数 -->
  <!-- 传递 active -->
  <channel-edit
    :active="active"
    :user-channels="channels"
    @close="isChannelEditShow = false"
    @update-active="active = $event"
  >
  </channel-edit>
  </van-popup>
  <!-- 弹出层 -->
</div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from '@/components/channel-edit/'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
  data () {
    return {
      active: 0,
      channels: [],
      isChannelEditShow: false // 控制频道编辑的显示状态
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.loadChannels()
  },
  mounted () {},
  methods: {
    async loadChannels () {
      // 判断用户是不是已经登录
      let channels = []
      if (this.user) {
        // 用户已经登录, 请求线上的用户频道数据列表
        const { data } = await getUserChannels()
        channels = data.data.channels
      } else {
        // 用户没有登录, 判断本地有没有数据列表, 有就获取本地的数据列表, 没有就获取默认推荐的数据列表
        const localChannels = getItem('user-channels')

        // 如果本地有数据,则使用本地的频道列表
        if (localChannels) {
          channels = localChannels
        } else {
          // 本地没有数据, 使用默认的频道列表
          const { data } = await getUserChannels()
          channels = data.data.channels
        }
      }
      this.channels = channels
      // 获取用户的频道列表
      // const { data } = await getUserChannels()
      // console.log(data)
      // this.channels = data.data.channels
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 277px;
    height: 32px;
    background-color: #5babfb;
    border: none;
    .van-icon {
      font-size: 16px;
    }
    .van-button__text {
      font-size: 14px;
    }
  }
  .tab-item {
    /deep/ .van-tab {
      border-right: 1px solid #edeff3;
      border-bottom: 1px solid #edeff3;
    }
    /deep/ .van-tabs__line {
      bottom: 20px;
      width: 15px !important;
      height: 3px;
      background-color: #3296fa;
    }
  }
  .wap-nav-placeholder {
    width: 33px;
    flex-shrink: 0;
  }
  .wap-nav-wrap {
    position: fixed;
    right: 0;
    width: 33px;
    height: 43px;
    background-color: #fff;
    opacity: 0.9;
    display: flex;
    justify-content: center;
    align-items: center;
    .van-icon {
      font-size: 24px;
    }
    &:before {
      content: '';
      width: 1px;
      height: 30px;
      background: url(./jianbian.png) no-repeat;
      background-size: contain;
      position: absolute;
      left: 0;
      top: 6px;
      bottom: 0;
    }
  }
}
</style>
