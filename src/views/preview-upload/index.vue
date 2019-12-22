<template>
  <div class="attach">
    <div class="attach-preview">
      <div class="attach-preview-wrap" :class="{print: isPrint}">
        <preview @click="fullscreen = true" />
      </div>
    </div>
    <div class="attach-upload">
      <order-upload />
    </div>
    <fullscreen-preview :fullscreen="fullscreen" @close="fullscreen = false" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import OrderUpload from './order-upload'
import Preview from '@/components/preview'
import FullscreenPreview from '@/components/fullscreen-preview'

export default {
  components: {
    Preview,
    OrderUpload,
    FullscreenPreview
  },

  data() {
    return {
      fullscreen: false
    }
  },

  computed: {
    ...mapState({
      previewData: ({ template }) => template.previewData,
      isPrint: ({ template }) => template.isPrint
    })
  },

  beforeRouteEnter(to, from, next) {
    if (from.path.indexOf('/order/list') === -1) {
      return next('/order/list')
    }
    next()
  }
}
</script>

<style lang="scss">
.attach {
  display: flex;
  flex: 1;
  height: 100%;
  background: #F8FAFE;
  &-preview {
    flex: 1;
    display: flex;
    justify-content: center;
    padding-top: 42px;
    &-wrap {
      // 根据设计稿扩大了1.5倍大小再缩放
      // width: 546px;
      // height: 833px;
      width: 728px;
      height: 1088px;
      transform-origin: top center;
      // transform: scale(0.75);
      transform: scale(.5);
      .preview-btn {
        transform: scale(2)
        // transform: scale(1.5)
      }
    }
    .print {
      transform: none
    }
  }
  &-upload {
    width: 370px;
    min-width: 370px;
    height: 100%;
    background: #fff;
  }
}
</style>
