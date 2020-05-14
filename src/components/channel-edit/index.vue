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
      @click="isEdit = !isEdit"
    >{{ isEdit ? '完成' : '编辑' }}</van-button>
  </van-cell>
  <van-grid :gutter="10">
    <van-grid-item
      class="grid-item"
      :icon="(isEdit && index !== 0) ? 'clear' : ''"
      v-for="(channel, index) in userChannels"
      :key="index"
      :text="channel.name"
      @click="onUserChannelClick(index)"
    />
  </van-grid>
  <!-- /我的频道 -->

  <!-- 频道推荐 -->
  <van-cell :border="false" center>
    <div slot="title" class="channel-title">频道推荐</div>
  </van-cell>
  <van-grid :gutter="10">
    <van-grid-item
      class="grid-item"
      v-for="(channel, index) in recommendChannels"
      :key="index"
      :text="channel.name"
      @click="onAdd(channel)"
    />
  </van-grid>
  <!-- /频道推荐 -->

</div>
</template>

<script>
import { getAllChannels } from '@/api/article'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    userChannels: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      allChannels: [],
      isEdit: false // 控制编辑的显示状态
    }
  },
  computed: {
    // 推荐的频道列表
    // 计算属性 会观测内部的依赖的数据 重新求值
    recommendChannels () {
      // 所有频道 - 我的频道 = 剩下的频道推荐
      // filter 查找满足条件的所有元素
      return this.allChannels.filter(channel => {
        // 判断 channel 是否属于 我的频道,返回对应的布尔值
        return !this.userChannels.find(userChannel => {
          // find 查找符合该条件的单个元素
          return userChannel.id === channel.id
        })
      })
      // for 循环
      // const arr = []
      // this.allChannels.forEach(channel => {
      //   let flag = false
      //   for (let i = 0; i< this.userChannels.length; i++) {
      //     if (this.userChannels[i].id === channel.id) {
      //       // 所有频道中的频道项属于用户频道
      //       flag = true
      //       break
      //     }
      //   }
      //   if (!flag) {
      //     arr.push(channel)
      //   }
      // })
      // return arr
    }
  },
  watch: {},
  created () {
    this.loadAllChannels()
  },
  mounted () {},
  methods: {
    async loadAllChannels () {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    onAdd (channel) {
      this.userChannels.push(channel)

      // 数据持久化未做
      if (this.user) {
        // 登录了,数据存储到线上
      } else {
        // 没有登录, 数据存储到本地
        setItem('user-channels', this.userChannels)
      }
    },
    // 删除我的频道的数据
    onUserChannelClick (index) {
      if (this.isEdit && index !== 0) {
        // 如果是编辑状态, 而且下标不等于0, 就删除数据
        // 在外面封装删除函数
        this.deleteChannel(index)
      } else {
        // 不是编辑状态, 就切换频道
        this.switchChannel(index)
      }
    },
    // 删除频道
    deleteChannel (index) {
      this.userChannels.splice(index, 1)

      // 数据持久化
    },
    // 切换频道
    switchChannel (index) {
      console.log(11)
    }
  }
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
    position: relative;
    /deep/ .van-grid-item__content{
      background-color: #f4f5f6;
      .van-grid-item__text {
        font-size: 14px;
        color: #222;
        margin-top: 0;
      }
    }
    /deep/ .van-grid-item__icon {
      position: absolute;
      right: -10px;
      top: -5px;
      font-size: 20px;
      color: #ccc;
    }
  }
}
</style>
