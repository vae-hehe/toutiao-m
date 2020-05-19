<template>
<div class="article-container">
  <!-- 导航栏 -->
  <van-nav-bar
    class="app-nav-bar"
    title="文章详情"
    left-arrow
    @click-left="$router.back()"
  />
  <!-- 导航栏 -->

  <div class="article-wrap">
  <!-- 用户 -->
    <h1 class="title">{{ article.title }}</h1>
    <van-cell center class="usesr-info">
      <div slot="title" class="name">{{ article.aut_name }}</div>
      <van-image
      slot="icon"
      class="avatar"
      round
      :src="article.aut_photo"
      ></van-image>
      <div slot="label" class="pubdate">{{ article. pubdate | relativeTime }}</div>
      <van-button
      class="follow-btn"
      round
      size="mini"
      :type="article.is_followed ? 'default' : 'info'"
      :icon="article.is_followed ? '' : 'plus'"
      :loading="isFollowedLoading"
      @click="onFollowed"
      >{{ article.is_followed ? '已关注' : '关注' }}</van-button>
    </van-cell>
  <!-- /用户 -->

  <!-- 正文 -->
    <!-- 不能使用 花括号绑定, 使用v-html绑定有格式的数据 html格式的字符串 -->
    <div
      class="markdown-body"
      v-html="article.content"
      ref="article-content"
    ></div>
  <!-- /正文 -->

  <!-- 文章评论列表 -->
  <!-- 更新总数量 -->
  <comment-list :source="articleId" :list="commentList" @update-total-count="totalCommentCount = $event"
  @reply-click="onReplyClick"
  ></comment-list>
  <!-- /文章评论列表 -->
  </div>

  <!-- 底部 -->
  <div class="footer">
    <van-button class="comment" type="default" round @click="isPostShow = true">写评论</van-button>
    <!-- 绑定总数量 -->
    <van-icon name="comment-o" :info="totalCommentCount" />
    <van-icon
      :color="article.is_collected ? 'orange' : ''"
      :name="article.is_collected ? 'star' : 'star-o'"
      @click="onCollect"
      :loading=isCollectedLoading
    />
    <van-icon
      :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
      @click="onLike"
      :color="article.attitude === 1 ? 'hotpink' : ''"
    />
    <van-icon name="share" />
  </div>
  <!-- /底部 -->

  <!-- 发布评论 -->
  <van-popup
    v-model="isPostShow"
    position="bottom"
  >
    <post-comment :target="articleId" @post-success="onPostSuccess"></post-comment>
  </van-popup>
  <!-- /发布评论 -->

  <!-- 评论回复 -->
  <van-popup
    v-model="isReplyShow"
    position="bottom"
  >
    <!-- v-if 这里目的是让组件随着弹出层的显示进行渲染和销毁,防止加载过的组件不重新渲染,导致数据不会重新加载的问题 -->
    <comment-reply v-if="isReplyShow" :comment="replyComment" :article-id="articleId" @close="isReplyShow = false"></comment-reply>
  </van-popup>
  <!-- /评论回复 -->
</div>
</template>

<script>
// 设置markdown
import './github-markdown.css'
import { getArticleById, getCollect, deleteCollect, getLike, deleteLike } from '@/api/article'
// 预览图片
import { ImagePreview } from 'vant'
import { deleteFollow, getFollow } from '@/api/user'
import CommentList from './components/comment-list'
import PostComment from './components/post-comment'
import CommentReply from './components/comment-reply'

export default {
  name: 'ArticleIndex',
  components: {
    CommentList,
    PostComment,
    CommentReply
  },
  // 在组件中获取动态路由参数
  // 方式一: this.$router.params.articleId
  // 方式二: props 传参
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  data () {
    return {
      article: {},
      isFollowedLoading: false,
      isCollectedLoading: false,
      isPostShow: false, // 评论的弹出状态
      commentList: [], // 文章评论列表
      totalCommentCount: 0, // 评论总数量
      isReplyShow: false, // 回复是否显示
      replyComment: {} // 当前回复评论对象
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () {},
  methods: {
    async loadArticle () {
      const { data } = await getArticleById(this.articleId)
      this.article = data.data
      // 因为在这里渲染了页面, 所以在这操作图片预览
      // 数据改变影响视图的更新(就是DOM更新) 不是立即的
      // 需要在修改数据之后马上操作被该数据影响的视图(DOM), 需要把这个代码放到 $nextTick 中
      // this.$nextTick 是vue中提供的方法
      this.$nextTick(() => {
        this.handlerPreviewImage()
      })
    },
    // 处理图片预览
    handlerPreviewImage () {
      // 1.获取DOM容器
      const articleContent = this.$refs['article-content']
      // 2.得到所有的 img 标签
      const imgs = articleContent.querySelectorAll('img')
      // 获取所有的图片地址
      const imgPath = [] // 收集图片地址
      // 3.循环 img 列表, 给 img 注册点击事件
      imgs.forEach((img, index) => {
        imgPath.push(img.src)
        img.onclick = () => {
          // 4.在事件处理函数中调用 ImagePreview() 预览
          ImagePreview({
            images: imgPath,
            startPosition: index
          })
        }
      })
    },
    async onFollowed () {
      // 判断是什么状态, 如果是已关注状态, 点击事件, 则是关注状态
      // 接口只是关注或者取消关注, 没有显示的效果, 必须设置
      this.isFollowedLoading = true
      if (this.article.is_followed) {
        await deleteFollow(this.article.aut_id)
      } else {
        await getFollow(this.article.aut_id)
      }
      this.article.is_followed = !this.article.is_followed
      this.isFollowedLoading = false
    },
    async onCollect () {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      // 判断是否选中
      if (this.article.is_collected) {
        await deleteCollect(this.article.art_id)
      } else {
        await getCollect(this.article.art_id)
      }
      this.article.is_collected = !this.article.is_collected
      this.$toast.success(`${this.article.is_collected ? '' : '取消'}收藏成功`)
    },
    async onLike () {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      if (this.article.attitude === 1) {
        await deleteLike(this.articleId)
        this.article.attitude = -1
      } else {
        await getLike(this.articleId)
        this.article.attitude = 1
      }
      this.$toast.success(`${this.article.attitude === 1 ? '' : '取消'}点赞成功`)
    },
    onPostSuccess (comment) {
      // 把评论数据对象放到评论列表顶部
      this.commentList.unshift(comment)

      // 更新评论的总数量
      this.totalCommentCount++

      // 关闭发布评论弹出层
      this.isPostShow = false
    },
    // 点击回复的评论对象 comment
    onReplyClick (comment) {
      console.log('onReplyClick', comment)
      this.replyComment = comment
      // 展示回复内容
      this.isReplyShow = true
    }
  }
}
</script>

<style scoped lang="less">
ul {
  list-style: unset;
}
.markdown-body {
  padding: 14px;
  background-color: #fff;
}
.article-wrap {
  position: fixed;
  top: 46px;
  bottom: 45px;
  left: 0;
  right: 0;
  overflow-y: auto;
}
.title {
  font-size: 20px;
  color: #3a3a3a;
  padding: 24px 20px 18px;
  background-color: #fff;
  margin: 0;
}
.usesr-info {
  .avatar {
    width: 35px;
    height: 35px;
    margin-right: 8px;
  }
  .name {
    font-size: 12px;
    color: #333;
  }
  .pubdate {
    font-size: 11px;
    color: #b4b4b4;
  }
  .follow-btn {
    width: 85px;
    height: 29px;
  }
}
.footer {
  width: 100%;
  height: 45px;
  box-sizing: border-box;
  padding-top: 10px;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  .comment {
    width: 140px;
    height: 22px;
    color: #a7a7a7;
    margin-left: 12px;
    margin-right: 20px;
  }
  .van-icon {
    font-size: 20px;
    margin-left: 28px;
    color: #777;
  }
}
</style>
