<template>
<div class="update-photo">
  <img :src="image">
  <van-nav-bar
    class="toolbar"
    left-text="取消"
    right-text="确认"
    @click-left="$emit('close')"
    @click-right="onConfirm"
  />
</div>
</template>

<script>
import { updateUserPhoto } from '@/api/user'

export default {
  name: 'UpdatePhoto',
  components: {},
  props: {
    file: {
      // type: Object,
      required: true
    }
  },
  data () {
    return {
      image: window.URL.createObjectURL(this.file)
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidclick: true
      })
      const fd = new FormData()
      fd.append('photo', this.file)
      await updateUserPhoto(fd)

      this.$emit('upate-photo', this.image)
      this.$emit('close')

      this.$toast.success('修改成功')
    }
  }
}
</script>

<style scoped lang="less">
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
