<template>
<div class="article-list">
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
  >
    <van-cell v-for="article in articles" :key="article.index" :title="article.title" />
  </van-list>
</div>
</template>

<script>
import { getArticles } from '@/api/article'
export default {
  name: 'ArticleList',
  components: {},
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
      timestamp: null
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
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
