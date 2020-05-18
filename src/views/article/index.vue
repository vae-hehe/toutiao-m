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
    <div slot="label" class="pubdate">{{ article.pubdate | relativeTime }}</div>
    <van-button
      class="follow-btn"
      round
      size="mini"
      type="info"
      icon="plus"
    >关注</van-button>
  </van-cell>
  <!-- 用户 -->

  <!-- 正文 -->
  <!-- /正文 -->
  <!-- 底部 -->
  <!-- /底部 -->
</div>
</template>

<script>
import { getArticleById } from '@/api/article'
export default {
  name: 'ArticleIndex',
  components: {},
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
      article: {}
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
    }
  }
}
</script>

<style scoped lang="less">
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
</style>
