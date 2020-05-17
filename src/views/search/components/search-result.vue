<template>
<div class="search-result">
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    >
    <van-cell
      v-for="(article, index) in list"
      :key="index"
      :title="article.title"
    />
  </van-list>
</div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'SearchResult',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 10
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      // 1.请求数据
      const { data } = await getSearchResult({
        page: this.page,
        per_page: this.perPage,
        q: this.searchText // 搜索关键字
      })
      // 2.把数据放到列表中
      const { results } = data.data
      this.list.push(...results)
      // 3.关闭本次的loading
      this.loading = false
      // 4.判断有没有下一页数据
      if (results.length) {
        // 有下一页, 页码加一
        this.page++
      } else {
        // 没有下一页, 停止加载
        this.finished = true
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-result {
  position: fixed;
  left: 0;
  right: 0;
  top: 50px;
  bottom: 0px;
  overflow-y: auto;
}
</style>
