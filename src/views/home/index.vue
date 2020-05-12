<template>
<div class="home-container">
  <van-nav-bar class="app-nav-bar">
    <van-button
      class="search-btn"
      slot="title"
      icon="search"
      type="info"
      round
      size="mini"
    > 搜索
    </van-button>
  </van-nav-bar>
</div>
</template>

<script>
export default {
  name: 'HomeIndex',
  components: {},
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
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
}
</style>
