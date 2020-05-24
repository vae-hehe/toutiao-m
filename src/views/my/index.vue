<template>
<div class="my-container">
  <van-cell-group v-if="user" class="my-info">
    <van-cell
      class="base-info"
      title="单元格"
      value="内容"
      center
      :border="false"
    >
      <van-image
        class="avatar"
        slot="icon"
        round
        fit="cover"
        :src="currentUser.photo"
      />
      <div slot="title" class="name">{{ currentUser.name }}</div>
      <van-button
        class="update-btn"
        size="small"
        round
        to="/user/profile"
      >编辑资料</van-button>
    </van-cell>
    <van-grid class="data-info" :border="false">
      <van-grid-item class="data-info-item">
        <div class="text-wrap" slot="text">
          <div class="count">{{ currentUser.art_count }}</div>
          <div class="text">头条</div>
        </div>
      </van-grid-item>
      <van-grid-item  class="data-info-item">
        <div class="text-wrap" slot="text">
          <div class="count">{{ currentUser.follow_count }}</div>
          <div class="text">关注</div>
        </div>
      </van-grid-item>
      <van-grid-item class="data-info-item">
        <div class="text-wrap" slot="text">
          <div class="count">{{ currentUser.fans_count }}</div>
          <div class="text">粉丝</div>
        </div>
      </van-grid-item>
      <van-grid-item class="data-info-item">
        <div class="text-wrap" slot="text">
          <div class="count">{{ currentUser.like_count }}</div>
          <div class="text">点赞</div>
        </div>
      </van-grid-item>
    </van-grid>
  </van-cell-group>

  <div v-else class="not-login">
  <div @click="$router.push({
    name: 'login',
    query: {
      redirect: $router.currentRoute.fullPath
    }
  })">
      <img class="mobile" src="./head.png" alt="">
    </div>
    <div class="text">登录 / 注册</div>
  </div>

  <van-grid class="nav-grid mb-4" :column-num="2">
    <van-grid-item
      class="nav-grid-item shoucang"
      icon-prefix="toutiao"
      icon="shoucang"
      text="收藏"
    />
    <van-grid-item
      class="nav-grid-item lishi"
      icon-prefix="toutiao"
      icon="lishi"
      text="历史"
    />
  </van-grid>
  <!-- is-link 右边的箭头 -->
  <van-cell class="cell" title="消息通知" is-link to="/" />
  <van-cell class="mb-4 cell" title="小智同学" is-link to="/user/chat" />
  <van-cell @click="onLogout" v-if="user" class="logout-cell" title="退出登录" />
</div>
</template>

<script>
import { mapState } from 'vuex'
import { getCurrentUser } from '@/api/user'

export default {
  name: 'MyIndex',
  components: {},
  props: {},
  data () {
    return {
      currentUser: {}
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    // 获取用户信息时, 判断是否已经登录
    if (this.user) {
      this.onLoadCurrentUser()
    }
  },
  mounted () {},
  methods: {
    onLogout () {
      this.$dialog.confirm({
        title: '退出提示',
        message: '确认退出吗'
      })
        .then(() => { // 确认执行
          // 清除登录状态
          this.$store.commit('setUser', null)
        })
        .catch(() => { // 退出执行
          // on cancel
        })
    },
    async onLoadCurrentUser () {
      const { data } = await getCurrentUser()
      this.currentUser = data.data
    }
  }
}
</script>

// scoped 本地作用域样式
<style scoped lang="less">
.my-container {
  .my-info {
    background: url(./banner.png) no-repeat;
    background-size: cover;
    .base-info {
      box-sizing: border-box;
      height: 115px;
      background-color: unset;
      padding-top: 38px;
      padding-bottom: 11px;
      .avatar {
        width: 66px;
        height: 66px;
        border: 1px solid #fff;
        margin-right: 11px;
      }
      .name {
        font-size: 15px;
        color: #fff;
      }
      .update-btn {
        // 建议不设置宽, 文字撑开
        height: 16px;
        font-size: 10px;
        color: #666;
      }
    }
    .data-info {
      .data-info-item {
        height: 65px;
        color: #ffffff;
        .text-wrap {
          display: flex;
          flex-direction: column;
          justify-items: center;
          align-items: center;
          .count {
            font-size: 18px;
          }
          .text{
            font-size: 11px;
          }
        }
      }
    }
    // 深度作用操作符, 或者 >>>, 但是less之类的预处理器无法识别, 或者 ::v-deep 这是 vue 单文件组件里面提供的特殊的语法
    /deep/ .van-grid-item__content {
      background-color: unset;
    }
  }
  .not-login {
    height: 180px;
    background: url(./banner.png) no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .mobile {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
  }
  .nav-grid {
    .nav-grid-item {
      height: 70px;
      /deep/ .toutiao {
        font-size: 22px;
      }
      .van-grid-item__text {
        font-size: 14px;
        color: #333;
      }
    }
    .shoucang {
      color: #eb5253;
    }
    .lishi {
      color: #ff9d1d;
    }
  }
  .cell {
    font-size: 15px;
  }
  .logout-cell {
    font-size: 15px;
    text-align: center;
    color: #d86262;
  }
  .mb-4 {
    margin-bottom: 4px;
  }
}
</style>
