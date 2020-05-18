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
  <comment-list :source="articleId"></comment-list>
  <!-- /文章评论列表 -->
  </div>

  <!-- 底部 -->
  <div class="footer">
    <van-button class="comment" type="default" round>写评论</van-button>
    <van-icon name="chat-o" />
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

export default {
  name: 'ArticleIndex',
  components: {
    CommentList
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
      isCollectedLoading: false
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
