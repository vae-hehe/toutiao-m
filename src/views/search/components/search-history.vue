<template>
<div class="search-history">
    <van-cell
      title="搜索历史"
    >
      <div v-if="isDeleteShow">
        <span @click="$emit('update-histories', [])">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon v-else name="delete" @click="isDeleteShow = true" />
    </van-cell>
    <van-cell
      v-for="(item, index) in searchHistories"
      :key="index"
      :title="item"
      @click="onDelete(item, index)"
    >
      <van-icon name="close" v-show="isDeleteShow" />
    </van-cell>
</div>
</template>

<script>
// import { setItem } from '@/utils/storage'
export default {
  name: 'SearchHistory',
  components: {},
  // prop 数据 如果是引用类型(数组, 对象)可以修改,
  // 注意这个修改值得是: user.name = 'Jack', arr.push(123), aee.splice(0,1)
  // 但是
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false // 删除显示状态
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onDelete (item, index) {
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1)
        // 持久化
        // 使用watch 父组件中
        // 1.修改本地存储数据
        // 2.请求接口删除数据
        // 无论是否登录, 都把数据持久化到本地存储
        // 如果已经登录, 删除线上的历史记录
        // 接口删除所有历史, 没有单个删除
        // setItem('search-histories', this.searchHistories)
        // 由于没有删除单个数据的接口, 把父组件的和线上合并的代码删除即可
        return
      }
      // 删除状态, 展示搜索结果
      this.$emit('search', item)
    }
  }
}
</script>

<style scoped lang="less"></style>
