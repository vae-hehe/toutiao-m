<template>
<div class="article-list" ref="article-list">
  <van-pull-refresh
    :success-text="refreshSuccessText"
    :success-duration="1500"
    v-model="isFreshLoading"
    @refresh="onRefresh"
  >
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <article-item
        v-for="(article, index) in articles"
        :key="index"
        :article="article"
      ></article-item>
      <!-- <van-cell v-for="article in articles" :key="article.index" :title="article.title" /> -->
    </van-list>
  </van-pull-refresh>
</div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item/'
import { debounce } from 'lodash'

export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      articles: [], // 数据列表
      loading: false, // 控制加载中的 loading 状态
      finished: false, // 控制加载结束的状态, 为 true 的时候, 不再触发加载更多
      timestamp: null,
      isFreshLoading: false,
      refreshSuccessText: ''
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    // 监听列表的滚动事件
    const articleList = this.$refs['article-list']
    // 设置防抖
    articleList.onscroll = debounce(() => {
      // 设置记住当前滚动的位置
      this.scrollTop = articleList.scrollTop
    }, 50)
  },
  activated () {
    // 从缓存中被激活
    // 将记住的位置, 重新设置给列表
    this.$refs['article-list'].scrollTop = this.scrollTop
  },
  methods: {
    async onLoad () {
      // 异步更新数据
      // 1. 请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id,
        timestamp: this.timestamp || Date.now(), // 时间戳, 相当于页码, 最新时间戳获取方式: +new Date() / Date.now()
        with_top: 1 // 是否包含置顶, 1 包含, 0 不包含
      })
      // 2. 把数据放到 articles 数组中
      //    push进去, 赋值的话, 之前的数据就没了
      const { results } = data.data
      this.articles.push(...results)

      // 3. 设置本次加载状态结束, 它才可以判定是否需要加载下一次,否则永远停在这
      this.loading = false

      // 4, 数据全部加载完成
      if (results.length) {
        // 更新获取下一页的页码
        this.timestamp = data.data.pre_timestamp
      } else {
        // 数据全部加载结束了, 不再触发加载更多
        this.finished = true
      }
    },
    async onRefresh () {
      // 请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id,
        timestamp: Date.now(), // 时间戳, 相当于页码, 最新时间戳获取方式: +new Date() / Date.now() 下拉刷新永远传最新时间戳, 而且数据不为空
        with_top: 1 // 是否包含置顶, 1 包含, 0 不包含
      })
      // 把数据放到数据列表中 (往顶部追加unshif)
      const { results } = data.data
      this.articles.unshift(...results)
      // 关闭刷新的状态, 不关闭会一直转
      this.isFreshLoading = false

      this.refreshSuccessText = `更新了${results.length}条数据`
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 50px;
  top: 90px;
  overflow-y: auto;
}
</style>
