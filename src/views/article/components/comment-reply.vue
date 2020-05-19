<template>
<div class="comment-reply">
  <!-- 头部信息 -->
  <van-nav-bar
    :title="`${comment.reply_count}条回复`"
  >
    <van-icon slot="left" name="cross" @click="$emit('close')" />
  </van-nav-bar>
  <!-- /头部信息 -->

  <!-- 当前评论项 -->
  <comment-item
    :comment="comment"
  ></comment-item>
  <!-- /当前评论项 -->
  <!-- 所有评论回复 -->
  <van-cell title="全部回复" />
  <comment-list
    :source="comment.com_id"
    type="c"
    :list="commentList"
  ></comment-list>
  <!-- /所有评论回复 -->
  <!-- 底部区域 -->
  <div class="footer">
    <van-button class="comment" type="default" round @click="isPostShow = true">写评论</van-button>
  </div>
  <!-- /底部区域 -->
  <!-- 发布回复 -->
  <van-popup
    v-model="isPostShow"
    position="bottom"
  >
    <post-comment
      :target="comment.com_id"
      :article-id="articleId"
      @post-success="onPostSuccess"
    ></post-comment>
  </van-popup>
  <!-- /发布回复 -->
</div>
</template>

<script>
import CommentItem from './comment-item'
import CommentList from './comment-list'
import PostComment from './post-comment'

export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    CommentList,
    PostComment
  },
  props: {
    // 查看回复的评论项
    comment: {
      type: Object,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      isPostShow: false,
      commentList: [] // 评论额回复列表
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onPostSuccess (comment) {
      // 将发布成功的评论放到评论列表的顶部
      this.commentList.unshift(comment)
      // 更新评论数量
      this.comment.reply_count++
      // 关闭发布回复的弹出层
      this.isPostShow = false
    }
  }
}
</script>

<style scoped lang="less">
.footer {
  width: 100%;
  height: 45px;
  line-height: 45px;
  box-sizing: border-box;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  .comment {
    width: 100%;
    height: 45px;
    color: #a7a7a7;
    margin-left: 12px;
    margin-right: 20px;
  }
}
</style>
