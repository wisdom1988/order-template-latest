<template>
  <div :class="classObj" class="app-wrapper">
    <logobar />
    <div class="user-container">
      <app-main />
    </div>
  </div>
</template>

<script>
import { AppMain, Logobar } from './components'

export default {
  name: 'UserLayout',
  components: {
    AppMain,
    Logobar
  },
  computed: {
    classObj() {
      return {
        mobile: this.device === 'mobile'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}

.user-container {
  padding: 40px;
  height: calc(100vh - 50px);
  background: #f8fafe;
}
</style>
