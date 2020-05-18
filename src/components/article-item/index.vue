<template>
<div>
  <van-cell
    class="article-item"
    :to="{
      name: 'article',
      params: {
        articleId: article.art_id
      }
    }"
  >
    <!-- van-multi-ellipsis--l3 标题过长, 只显示三行 -->
    <div class="title van-multi-ellipsis--l3" slot="title">{{ article.title }}</div>
    <div slot="label">
      <!-- 三图设置在label插槽中 -->
      <div
        class="cover-wrap"
        v-if="article.cover.type === 3"
      >
        <div
          class="cover-wrap-item"
          v-for="(img, index) in article.cover.images"
          :key="index"
        >
          <van-image
            class="cover-image"
            fit="cover"
            :src="img"
          />
        </div>
      </div>
      <div class="label-wrap">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}个评论</span>
        <span>{{ article.pubdate | relativeTime }}</span>
      </div>
    </div>
    <!-- 默认插槽名字是default ,可以省略 -->
    <van-image
      class="right-cover"
      v-if="article.cover.type === 1"
      fit="cover"
      :src="article.cover.images[0]"
    />
  </van-cell>
</div>
</template>

<script>
export default {
  name: 'ArticleItem',
  components: {},
  props: {
    article: {
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
  methods: {}
}
</script>

<style scoped lang="less">
.article-item {
  .title {
    font-size: 16px;
    color: #3a3a3a;
  }
  /deep/ .van-cell__value {
      flex: unset;
      width: 116px;
      height: 73px;
      margin-left: 12px;
  }
  .right-cover {
    width: 116px;
    height: 73px;
  }
  .cover-wrap {
    padding: 15px 0;
    display: flex;
    .cover-wrap-item {
      flex: 1;
      height: 73px;
      &:not(:last-child) {
        padding-right: 4px;
      }
      .cover-image {
        width: 100%;
        height: 73px;
      }
    }
  }
  .label-wrap {
    font-size: 11px;
    color: #b4b4b4;
    span {
      margin-right: 12px;
    }
  }
}

</style>
