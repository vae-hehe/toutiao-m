<template>
<div class="search-suggestion">
  <van-cell
    icon="search"
    :title="str"
    v-for="(str, index) in suggestions"
    :key="index"
  ></van-cell>
</div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
// 防抖
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: []
    }
  },
  computed: {},
  watch: {
    // 监视数据的变化
    // 属性名: 要监视的数据的名称
    // searchText () {}, 等价于下面的写法
    // 完成写法
    searchText: {
      // 当数据发生之后,立即执行 handler 处理函数 名字固定
      handler: debounce(async function () {
      // async handler () {
        const { data } = await getSearchSuggestions(this.searchText)
        this.suggestions = data.data.options
      }, 50),
      // 该回调, 在侦听开始之后立即调用
      immediate: true
    }
  },
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style scoped lang="less"></style>
