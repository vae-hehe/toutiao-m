<template>
<div class="update-name">
  <!-- 导航栏 -->
  <van-nav-bar
    title="修改昵称"
    left-text="取消"
    right-text="完成"
    @click-left="$emit('close')"
    @click-right="onConfirm"
  />
  <!-- /导航栏 -->
  <div class="name-filed-wrap">
    <van-field
      v-model="localName"
      rows="2"
      autosize
      type="textarea"
      maxlength="7"
      placeholder="请输入留言"
      show-word-limit
    />
  </div>
</div>
</template>

<script>
import { updateUserProfile } from '@/api/user'

export default {
  name: 'UpdateName',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    },
    gender: {
      type: Number
    }
  },
  data () {
    return {
      // 使用 name 的值进行初始化
      localName: this.value
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidclick: true
      })
      try {
        // 请求提交更新用户昵称
        await updateUserProfile({
          name: this.localName
        })
        // 更新成功 -> 修改父组件的 name -> 关闭弹出层
        // this.$emit('update-name', this.localName)
        this.$emit('input', this.localName)
        this.$emit('close')

        this.$toast.success('保存成功')
      } catch (err) {
        if (err && err.response && err.response.status === 409) {
          this.$toast.fail('昵称已存在')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.name-filed-wrap {
  padding: 10px;
}
</style>
