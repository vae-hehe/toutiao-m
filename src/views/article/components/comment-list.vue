<template>
<div class="comment-list">
  <van-cell>全部评论</van-cell>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    >
    <comment-item
      v-for="(comment, index) in list"
      :key="index"
      :title="comment.content"
      :comment="comment"
      @reply-click="$emit('reply-click', $event)"
    ></comment-item>
    <!-- <van-cell v-for="(comment, index) in list" :key="index" :title="comment.content" /> -->
  </van-list>
</div>
</template>

<script>
import { getCommentList } from '@/api/comment'
import CommentItem from './comment-item'

export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    type: {
      type: String,
      default: 'a'
    },
    list: {
      // 数组或对象的默认值, 必须通过函数返回
      type: Array,
      default: () => []
      // default: function () {
      //   return []
      // }
    }
  },
  data () {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 10
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      // 1.获取数据
      const { data } = await getCommentList({
        type: this.type, // 文章的评论传a, 评论回复传c
        source: this.source.toString(), // 文章id
        offset: this.offset, // 页码, 不传从第一页开始读数据
        limit: this.limit // 每页大小
      })

      // 获取列表的时候, 得到列表总数, 就是评论的总数
      // 要在图标上显示. 需要把数据发送到父组件, 因为图标在index页面
      this.$emit('update-total-count', data.data.total_count)

      const { results } = data.data
      // 2.把数据放到列表中
      this.list.push(...results)
      // 3.loading关闭
      this.loading = false
      // 4.判断有没有数据,有, 更新获取下一页数据, 没有, finish为true
      if (results.length) {
        this.offset = data.data.last_id
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
