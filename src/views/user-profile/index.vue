<template>
<div class="user-profile">
  <!-- 导航栏 -->
  <van-nav-bar
    class="app-nav-bar"
    title="个人信息"
    left-arrow
    @click-left="$router.back()"
  />
  <!-- /导航栏 -->

  <!-- value 里面只能放文本 -->
  <van-cell title="头像" is-link center>
    <van-image
      class="photo"
      :src="user.photo"
      fit="cover"
      round
    />
  </van-cell>
  <van-cell
    title="昵称"
    is-link
    :value="user.name"
  />
  <van-cell
    title="性别"
    is-link
    :value="user.gender === 1 ? '女' : '男' "
  />
  <van-cell
    title="生日"
    is-link
    :value="user.birthday"
  />
</div>
</template>

<script>
import { getUserProfile } from '@/api/user'

export default {
  name: 'UserProfile',
  components: {},
  props: {},
  data () {
    return {
      user: {}
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUserProfile()
  },
  mounted () {},
  methods: {
    async loadUserProfile () {
      const { data } = await getUserProfile()
      this.user = data.data
    }
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .photo {
    width: 30px;
    height: 30px;
  }
}
</style>
