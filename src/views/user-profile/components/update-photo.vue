<template>
<div class="update-photo">
  <img :src="image" ref="image" class="image">
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
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

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
      image: window.URL.createObjectURL(this.file),
      cropper: null // 裁切器实例
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    const image = this.$refs.image
    this.cropper = new Cropper(image, {
      aspectRatio: 1,
      viewMode: 1,
      dragMode: 'move',
      cropBoxMovable: false,
      cropBoxResizable: true, // 裁切框可以改变大小
      background: false,
      movable: true
    })
  },
  methods: {
    getCroppedCanvas () {
      return new Promise(resolve => {
        this.cropper.getCroppedCanvas().toBlob((file) => {
          resolve(file)
        })
      })
    },
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidclick: true
      })

      const file = await this.getCroppedCanvas()
      const fd = new FormData()
      fd.append('photo', file)
      await updateUserPhoto(fd)

      this.$emit('upate-photo', window.URL.createObjectURL(file))
      this.$emit('close')

      this.$toast.success('修改成功')
    }
  }
}
</script>

<style scoped lang="less">
.update-photo {
  height: 100%;
}
.toolbar {
  background-color: #000;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
/deep/ .van-nav-bar__text {
  color: #ffffff;
}
.image {
  display: block;
  max-width: 100%;
}
</style>
