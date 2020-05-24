<template>
  <div id="app">
    <!-- 路由出口 -->
    <!-- 给所有的一级路由出口设置缓存 -->
    <!-- 条件缓存,设置只缓存LayoutIndex -->
    <keep-alive :include="cachePages">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'App',
  computed: {
    ...mapState(['cachePages'])
  }
}
</script>

<style lang="less"></style>
