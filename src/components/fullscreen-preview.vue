<template>
  <modal :visible="fullscreen" @click="$emit('close')">
    <div class="modal-preview-wrap">
      <div class="modal-preview">
        <preview :preview-data="previewData" :show-btns="false" />
      </div>
    </div>
  </modal>
</template>

<script>
import { mapState } from 'vuex'
import Modal from './modal'
import Preview from './preview'

export default {
  components: {
    Preview,
    Modal
  },
  props: {
    fullscreen: {
      type: Boolean,
      required: true
    }
  },

  computed: {
    ...mapState({
      previewData: ({ template }) => template.previewData
    })
  }
}
</script>

<style lang="scss">
.modal-preview {
  padding: 30px 0;
  height: 846px;
  &-wrap {
    position: absolute;
    top: 0px;
    left: 50%;
    margin-left: -300px;
    width: 600px;
    height: 100%;
    overflow: auto;
    &::-webkit-scrollbar{
      /*垂直滚动条的宽*/
      width: 0;
      height: 0;
    }
  }
}
</style>
