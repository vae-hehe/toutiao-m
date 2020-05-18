<template>
<div class="search-container">
  <!-- 搜索栏 -->
  <form action="/">
    <van-search
       v-model="searchText"
       placeholder="请输入搜索关键词"
       show-action
       @search="onSearch(searchText)"
       @cancel="$router.back()"
       @focus="isResultShow = false"
    />
  </form>
  <!-- /搜索栏 -->

  <!-- 搜索结果 -->
  <search-result
    v-if="isResultShow"
    :searchText="searchText"
  ></search-result>
  <!-- /搜索结果 -->

  <!-- 联想建议 -->
  <search-suggestion
    v-else-if="searchText" :searchText="searchText"
    @search="onSearch"
  ></search-suggestion>
  <!-- /联想建议 -->

  <!-- 历史记录 -->
  <search-history
    v-else
    :searchHistories="searchHistories"
    :search="onSearch"
  ></search-history>
  <!-- /历史记录 -->
</div>
</template>

<script>
import SearchSuggestion from './components/search-suggestion'
import SearchHistory from './components/search-history'
import SearchResult from './components/search-result'
// import { getSearchHistories } from '@/api/search'
import { setItem, getItem } from '@/utils/storage'
import { mapState } from 'vuex'
// import searchHistoryVue from './components/search-history.vue'
export default {
  name: 'SearchIndex',
  components: {
    SearchSuggestion,
    SearchHistory,
    SearchResult
  },
  props: {},
  data () {
    return {
      searchText: '', // 搜索输入框的内容
      isResultShow: false,
      searchHistories: [] // 搜索历史数据
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.loadSearchHistories()
  },
  mounted () {},
  methods: {
    onSearch (searchText) {
      // 把输入框设置为要搜索的文本
      this.searchText = searchText

      const index = this.searchHistories.indexOf(searchText)
      if (index !== -1) {
        // 把重复项删除
        this.searchHistories.splice(index, 1)
      }

      // 记录搜索历史记录, 最新的在前面
      this.searchHistories.unshift(searchText)

      setItem('search-histories', this.searchHistories)
      console.log(this.searchHistories)

      // 展示搜索结果
      this.isResultShow = true
    },
    // 数据合并 并 去重
    async loadSearchHistories () {
      const searchHistories = getItem('search-histories') || []
      // if (this.user) {
      //   const { data } = await getSearchHistories()
      //   searchHistories = [...new Set([...searchHistories, ...data.data.keywords])]
      // }
      this.searchHistories = searchHistories
    }
  }
}
</script>

<style scoped lang="less"></style>
