<template>
<van-cell class="comment-item">
  <van-image
    slot="icon"
    round
    fit="cover"
    :src="comment.aut_photo"
    class="avatar"
  ></van-image>
  <div slot="title">
    <div class="title-wrap">
      <div class="name">{{ comment.aut_name }}</div>
      <div class="like-wrap" @click="onCommentLiked">
        <van-icon
          class="like-icon"
          :class="{
            liked: comment.is_liking
          }"
          :name="comment.is_liking ? 'good-job' : 'good-job-o'"
        />
        <span class="like-count">{{ comment.like_count }}</span>
      </div>
    </div>
    <div class="content">{{ comment.content }}</div>
    <div>
      <span class="pubdate">{{ comment.pubdate | dateTime('MM-DD HH:mm') }}</span>
      <!-- 自定义事件 -->
      <van-button
        class="reply-btn"
        size="mini"
        round
        @click="$emit('reply-click', comment)"
      >{{ comment.reply_count }}回复</van-button>
    </div>
  </div>
</van-cell>
</template>

<script>
import { getCommentLike, deleteCommentLike } from '@/api/comment'

export default {
  name: 'CommentItem',
  components: {},
  props: {
    comment: {
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
  methods: {
    async onCommentLiked () {
      const commentId = this.comment.com_id.toString()
      if (this.comment.is_liking) {
        await deleteCommentLike(commentId)
        // 点赞的数量
        this.comment.like_count--
      } else {
        await getCommentLike(commentId)
        this.comment.like_count++
      }
      this.comment.is_liking = !this.comment.is_liking
    }
  }
}
</script>

<style scoped lang="less">
.comment-item {
  .avatar {
    width: 36px;
    height: 36px;
    margin-right: 13px;
  }
  .name {
    font-size: 14px;
    color: #406599;
  }
  .content {
    font-size: 16px;
    color: #222;
  }
  .pubdate {
    font-size: 10px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
  }
  .like-wrap {
    display: flex;
    align-items: center;
    vertical-align: middle;
  }
  .like-icon.liked {
    color: hotpink;
  }
}
</style>
