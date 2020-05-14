<template>
<div class="channel-edit">
  <!-- 我的频道 -->
  <van-cell :border="false" center>
    <div slot="title" class="channel-title">我的频道</div>
    <!-- 默认插槽 -->
    <van-button
      type="danger"
      plain
      round
      size="mini"
    >编辑</van-button>
  </van-cell>
  <van-grid :gutter="10">
    <van-grid-item
      class="grid-item"
      v-for="value in 8"
      :key="value"
      text="文字"
    />
  </van-grid>
  <!-- /我的频道 -->

  <!-- 频道推荐 -->
  <van-cell :border="false" center>
    <div slot="title" class="channel-title">频道推荐</div>
  </van-cell>
  <van-grid :gutter="10">
    <van-grid-item
      v-for="(channel, index) in userChannels"
      :key="index"
      text="channel.name"
    />
  </van-grid>
  <!-- /频道推荐 -->

</div>
</template>

<script>
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    userChannels: {
      type: Object,
      required: true
    }
  },
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
.channel-edit {
  padding-top: 54px;
  .channel-title {
    font-size: 16px;
    color: #333;
  }
  .grid-item {
    width: 80px;
    height: 43px;
    /deep/ .van-grid-item__content{
      background-color: #f4f5f6;
      .van-grid-item__text {
        font-size: 14px;
        color: #222;
      }
    }
  }
}
</style>
