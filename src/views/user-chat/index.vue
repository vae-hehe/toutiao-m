<template>
<div class="user-chat">
  <!-- 导航栏 -->
  <van-nav-bar
    class="app-nav-bar"
    title="小智同学"
    left-arrow
    @click-left="$router.back()"
  ></van-nav-bar>
  <!-- /导航栏 -->

  <!-- 消息列表 -->
  <van-cell-group class="message-list-wrap" ref="message-list">
    <van-cell
      :title="item.msg"
      v-for="(item, index) in messages"
      :key="index"
    />
  </van-cell-group>
  <!-- /消息列表 -->

  <!-- 发送消息 -->
  <van-cell-group class="send-message-wrap">
    <van-field
      v-model="message"
      placeholder="请输入消息"
      :border="false"
    />
    <van-button
      type="primary"
      size="small"
      @click="onSend"
    >发送</van-button>
  </van-cell-group>
  <!-- /发送消息 -->
</div>
</template>

<script>
import io from 'socket.io-client'
import { setItem, getItem } from '@/utils/storage'

export default {
  name: 'UserChat',
  components: {},
  props: {},
  data () {
    return {
      message: '',
      socket: null,
      messages: getItem('chat-messages') || [] // 数据持久化, 从本地获取
    }
  },
  computed: {},
  watch: {
    messages () {
      setItem('chat-messages', this.messages)

      // 如果要在操作数据之后立即操作数据影响视图 DOM , 那么最好把代码放到 $nextTick() 函数中
      // 数据改变影响视图更新不是立即的
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    }
  },
  created () {
    // 建立连接
    const socket = io('http://ttapi.research.itcast.cn/')

    this.socket = socket

    socket.on('connect', () => {
      console.log('连接建立成功')
    })

    // 断开连接了
    socket.on('disconnect', () => {
      console.log('断开连接了')
    })

    // 监听 message  事件, 接收服务器消息
    socket.on('message', data => {
      console.log(data)
      // 把对方发给我的数据放到数据中
      this.messages.push(data)
    })
  },
  mounted () {
    // this.scrollToBottom()
  },
  methods: {
    onSend () {
      // 请求发送数据
      const data = {
        msg: this.message,
        timestamp: Date.now()
      }
      this.socket.emit('message', data)
      this.messages.push(data)
      this.message = ''
    },

    scrollToBottom () {
      const list = this.$refs['message-list']
      list.scrollTop = list.scrollHeight
    }
  }
}
</script>

<style scoped lang="less">
.send-message-wrap {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  padding: 0 14px;
  align-items: center;
}
.message-list-wrap {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 44px;
  top: 46px;
  overflow-y: auto;
}
</style>
