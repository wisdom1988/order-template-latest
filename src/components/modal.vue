<template>
  <div
    v-show="visible"
    class="modal-wrap"
  >
    <slot />
    <div
      v-if="showBg"
      class="modal-bg"
      @click="handleClick"
    />
  </div>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    showBg: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      top: 0
    }
  },

  watch: {
    visible() {
      this.$nextTick(() => {
        this.toogleClass()
      })
    }
  },

  beforeDestroy() {
    document.body.classList.remove('dada-modal-open')
    document.body.scrollTop = this.top
    document.documentElement.scrollTop = this.top
  },

  mounted() {
    this.toogleClass()
  },

  methods: {
    toogleClass() {
      if (this.visible) {
        this.top = document.body.scrollTop ||
          document.documentElement.scrollTop
        document.body.style.top = `-${this.top}px`
        document.body.classList.add('dada-modal-open')
        return
      }
      document.body.classList.remove('dada-modal-open')
      document.body.scrollTop = this.top
      document.documentElement.scrollTop = this.top
    },

    handleClick() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="sass">
body.dada-modal-open
  position: fixed
  width: 100%
</style>

<style lang="scss" scoped>
.modal-wrap {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  .modal-bg {
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .6);
  }
}
</style>
