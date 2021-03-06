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
    <!-- 条件判定是 true 就会作用类名,条件判定是 false 就不会作用类名 -->
    <van-grid-item
      class="grid-item"
      :class="{active: index === active}"
      :icon="(isEdit && index !== 0) ? 'clear' : ''"
      v-for="(channel, index) in userChannels"
      :key="index"
      :text="channel.name"
      @click="onUserChannelClick(channel, index)"
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
import { getAllChannels, addUserChannels, deleteUserChannels } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    userChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
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
    // 获取容器中的数据, 作为自己的数据使用
    ...mapState(['user']),
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
    async onAdd (channel) {
      this.userChannels.push(channel)
      // 数据持久化未做
      if (this.user) {
        // 登录了,数据存储到线上
        await addUserChannels({
          channels: [ // 数组里面放对象
            {
              id: channel.id,
              seq: this.userChannels.length // 顺序序号, 我的频道的数据的长度
            }
          ]
        })
      } else {
        // 没有登录, 数据存储到本地
        setItem('user-channels', this.userChannels)
      }
    },
    // 删除我的频道的数据
    onUserChannelClick (channel, index) {
      if (this.isEdit && index !== 0) {
        // 如果是编辑状态, 而且下标不等于0, 就删除数据
        // 在外面封装删除函数
        this.deleteChannel(channel, index)
      } else {
        // 不是编辑状态, 就切换频道
        this.switchChannel(index)
      }
    },
    // 删除频道
    async deleteChannel (channel, index) {
      // 如果删除的是,激活索引的频道之前的频道,active-1
      if (index <= this.active) {
        // 需要激活的频道的索引
        // 使用 update-active 传递数据, 就相当于是要激活的频道
        this.$emit('update-active', this.active - 1)
      }
      this.userChannels.splice(index, 1)

      // 数据持久化
      // 判断用户是否已经登录
      if (this.user) {
        // 用户已经登录, 将数据存储到线上
        await deleteUserChannels(channel.id)
      } else {
        // 用户没有登录, 将数据存储到本地
        setItem('user-channels', this.userChannels)
      }
    },
    // 切换频道
    // 使用子组件和父组件之间的通信
    switchChannel (index) {
      // 切换频道
      this.$emit('update-active', index)
      // 关闭弹出层
      this.$emit('close')
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
  .active {
    /deep/ .van-grid-item__text {
      color: red !important;
    }
  }
}
</style>
