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
  <input type="file" hidden ref="file">
  <van-cell title="头像" is-link center @click="$refs.file.click()">
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
    @click="isEditGenderShow = true"
  />
  <van-cell
    title="生日"
    is-link
    :value="user.birthday"
    @click="isEditBirthdayShow = true"
  />

  <!--
    当传递给子组件的数据及要使用又要修改, 例如这里的 name
    这是可以使用 v-model 简写
    本质还是 子传父
  -->
  <!-- 修改昵称 -->
  <van-popup
    v-model="isEditNameShow"
    position="bottom"
    :style="{ height: '100%' }"
  >
    <!-- <update-name
      :name="user.name"
      @update-name="user.name = $event"
      @close="isEditNameShow = false"
    ></update-name> -->

    <!--
      v-model="user.name"
        默认传递一个名字叫 value 的数据
        :value="user.name"
        默认监听 input 事件
        @input="user.name = $event"
      v-model 的本质还是父子组件通信, 它仅仅简化了父组件的通信, 子组件还是一样, 但是要绑定的数据必须是 value 和 input
    -->

    <!--
      v-model 只能使用一次
    -->

    <!--
      如果有多个数据保持同步, 使用 .sync 修饰符, 可以有多个
      :gender="user.gender"
      @update-gender="user.gender = $event"

      :gender.sync="user.gender"
        :gender="user.gender"
        @update:gender="user.gender = $event"
        @update:属性名称="user.gender = $event"

      我们一般把最常用的数据设计为 v-model 绑定, 把不太常用的数据设计为 .sync
    -->

    <!-- 每次重新加载昵称数据 -->
    <update-name
      v-if="isEditNameShow"
      v-model="user.name"
      @close="isEditNameShow = false"
    ></update-name>
  </van-popup>
  <!-- /修改昵称 -->

  <!-- 修改性别 -->
  <van-popup
    v-model="isEditGenderShow"
    position="bottom"
  >
    <update-gender
      @close="isEditGenderShow = false"
      v-model="user.gender"
    ></update-gender>
  </van-popup>
  <!-- /修改性别 -->

  <!-- 修改生日 -->
  <van-popup
    v-model="isEditBirthdayShow"
    position="bottom"
  >
    <update-birthday
      v-if="isEditBirthdayShow"
      @close="isEditBirthdayShow = false"
      v-model="user.birthday"
    ></update-birthday>
  </van-popup>
  <!-- /修改生日 -->
</div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'

export default {
  name: 'UserProfile',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday
  },
  props: {},
  data () {
    return {
      user: {},
      isEditNameShow: false, // 昵称的弹出层
      isEditGenderShow: false, // 性别弹出层
      isEditBirthdayShow: false
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
