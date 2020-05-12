<template>
<div class="login-container">
  <!-- 导航栏 -->
  <!--
    left-arrow 左侧箭头
  -->
  <van-nav-bar
    class="app-nav-bar"
    title="注册 / 登录"
    left-arrow
    @click-left="$router.back()"
  />
  <!-- /导航栏 -->
  <!-- 登录表单 -->
  <!--
    基于 Vant 的表单验证
    1. 使用 van-form 组件包裹所有的表单项 van-filed
    2. 给 van-form 绑定 submit 事件
       当表单提交的时候会触发
       提示: 之后表单验证通过, 它才会调用 submit 事件
    3. 使用 Field 的rules属性定义校验规则
    4. 为 true 的属性, validate-first 可以直接写,但是 false ,就得等于写 :validate-first="false"
  -->
  <van-form
    :show-error="false"
    :show-error-message="false"
    validate-first
    ref="login-form"
    @submit="onLogin"
    @failed="onFailed"
  >
    <van-field
      v-model="user.mobile"
      icon-prefix="toutiao"
      left-icon="shouji"
      placeholder="请输入手机号"
      center
      name="mobile"
      :rules="formRules.mobile"
    />
    <van-field
      v-model="user.code"
      clearable
      icon-prefix="toutiao"
      left-icon="yanzhengma"
      center
      placeholder="请输入验证码"
      name="code"
      :rules="formRules.code"
    >
    <template #button>
      <van-count-down
      v-if="isCountDownShow"
        :time="1000 * 60"
        format="ss s"
        @finish="isCountDownShow = false"
      />
      <van-button
        v-else
        class="send-btn"
        size="small"
        round
        :loading="isSendSmsLoading"
        @click.prevent="onSendSms"
      >发送验证码</van-button>
    </template>
    </van-field>
    <div class="login-btn-wrap">
      <van-button
        class="login-btn"
        type="info"
        block
      >登录</van-button>
    </div>
  </van-form>
  <!-- /登录表单 -->
</div>
</template>

<script>
import { login, sendSms } from '@/api/user'
// 加载 toast
import { Toast } from 'vant'

export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      formRules: {
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3|5|7|8]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      isCountDownShow: false, // 控制倒计时和方式按钮的显示状态
      isSendSmsLoading: false // 发送验证码的loading
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLogin () {
      Toast.loading({
        message: '加载中...', // 提示文本
        forbidClick: true, // 禁止背景点击
        duration: 0 // 展示时长(ms), 值为0时, toast 不会消失
      })
      // 1. 找到数据接口
      // 2. 封装请求方法
      // 3. 请求调用登录
      try {
        const { data } = await login(this.user)
        // 4. 处理相应结果
        console.log(data)
        // 或者不用加载 Toast, 使用 this.$toast 方法也可以
        this.$router.push('/my')
        this.$toast.success('登录成功')

        // 将后端返回的用户登录状态 (token等数据) 放到 Vuex 容器中
        this.$store.commit('setUser', data.data)

        // 登录成功, 跳转到原来的界面
        this.$router.back()
      } catch (err) {
        console.log(err)
        Toast.fail('登陆失败, 手机号或验证码错误')
      }
    },
    onFailed (error) {
      if (error.errors[0]) {
        this.$toast({
          message: error.errors[0].message,
          position: 'top' // 防止手机键盘太高看不见提示消息
        })
      }
    },
    async onSendSms () {
      try {
        await this.$refs['login-form'].validate('mobile')
        // 验证通过, 请求发送验证码
        // 验证通过 -> 请求发送验证码 -> 接收短信 -> 输入验证码 -> 请求登录
        this.isSendSmsLoading = true // 展示按钮的 loading 状态, 防止网络慢, 多次触发
        await sendSms(this.user.mobile)
        // 短信发送成功,倒计时提示
        // 请求发送验证码 -> 隐藏发送按钮, 显示倒计时
        this.isCountDownShow = true
        // 倒计时结束 -> 隐藏倒计时, 显示发送按钮
        // 监视倒计时的 finish 事件处理
      } catch (error) {
        let message = ''
        if (error && error.response && error.response.status === 429) {
          // 发送短信失败的错误提示
          message = '发送太频繁了,请稍后重试'
        } else if (error.name === 'mobile') {
          // 表单验证失败
          message = error.message
        } else {
          // 未知错误
          message = '发送失败,请稍后重试'
        }
        // 提示用户
        this.$toast({
          message,
          position: 'top' // 防止手机键盘太高看不见提示消息
        })
      }
      // 关闭loading
      this.isSendSmsLoading = false
      // 校验手机号码
    }
  }
}
</script>

<style scoped lang="less">
.send-btn {
  width: 76px;
  height: 23px;
  background-color: #eeeeee;
  .van-button__text {
    font-size: 11px;
    color: #666666;
  }
}
.login-container {
  .login-btn-wrap {
    padding: 26px 16px;
    .login-btn {
        background-color: #6db4fb;
        border: none;
        .van-button__text {
          font-size: 15px;
        }
    }
  }
}
</style>
