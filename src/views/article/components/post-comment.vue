<template>
<div class="post-comment">
  <!-- trim 去除首尾空格 -->
  <van-field
    v-model.trim="message"
    rows="2"
    autosize
    type="textarea"
    maxlength="50"
    placeholder="请输入留言"
    show-word-limit
  />
  <!-- 点击发布,没有发布成功的时候禁用输入框 -->
  <van-button
    size="mini"
    :disabled="!message"
    @click="onPost"
  >发布</van-button>
</div>
</template>

<script>
import { addComment } from '@/api/comment'

export default {
  name: 'PostComment',
  components: {},
  props: {
    // 如果是发布文章评论, 则传递文章 ID
    // 如果是发布文章回复, 则传递评论 ID
    target: {
      type: [Number, Object, String],
      required: true
    },
    // 如果是发布文章评论回复, 则也需要传递文章ID
    articleId: {
      type: [Number, String, Object],
      default: null
    }
  },
  data () {
    return {
      message: ''
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onPost () {
      this.$toast.loading({
        message: '发布中',
        forbidClick: true
      })
      // 找到数据接口
      // 封装请求方法
      // 请求提交数据
      const { data } = await addComment({
        art_id: this.articleId === null ? null : this.articleId.toString(), // 文章id, 回复传, 评论不传, 无效:null, 有效 toString()
        target: this.target.toString(), // 评论的目标的id
        content: this.message // 评论的内容
      })
      console.log(data)
      this.$emit('post-success', data.data.new_obj)

      this.$toast.success('发布成功')

      // 清空输入框的内容
      this.message = ''
    }
  }
}
</script>

<style scoped lang="less">
.post-comment {
  padding: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
