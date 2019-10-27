<template>
  <modal :visible="visible">
    <div class="box">验证码</div>
  </modal>
</template>

<script>
import Modal from '@/components/modal'

export default {
  components: {
    Modal
  },

  props: {
    visible: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  background: #fff;
  width: 280px;
  height: 192px;
  border-radius: 4px;
  padding: 32px;
}
</style>
