<template>
<div class="comment-list">
  <van-cell>全部评论</van-cell>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    >
    <van-cell v-for="(comment, index) in list" :key="index" :title="comment.content" />
  </van-list>
</div>
</template>

<script>
import { getCommentList } from '@/api/comment'

export default {
  name: 'CommentList',
  components: {},
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      list: [],
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
        type: 'a', // 文章的评论传a, 评论回复传c
        source: this.source, // 文章id
        offset: this.offset, // 页码, 不传从第一页开始读数据
        limit: this.limit // 每页大小
      })
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
