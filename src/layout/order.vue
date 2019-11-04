<template>
  <div :class="classObj" class="app-wrapper">
    <logobar />
    <div class="order-container">
      <navbar :order="true" />
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, AppMain, Logobar } from './components'

export default {
  name: 'Layout',
  components: {
    Navbar,
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

  .order-container {
		height: calc(100vh - 50px)
	}
</style>
