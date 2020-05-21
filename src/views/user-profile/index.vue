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
    @click="isEditNameShow = true"
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

  <van-popup
    v-model="isEditNameShow"
    position="bottom"
    :style="{ height: '100%' }"
  >
    <update-name
      :name="user.name"
      @update-name="user.name = $event"
      @close="isEditNameShow = false"
    ></update-name>
  </van-popup>
</div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name'

export default {
  name: 'UserProfile',
  components: {
    UpdateName
  },
  props: {},
  data () {
    return {
      user: {},
      isEditNameShow: false
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
  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
