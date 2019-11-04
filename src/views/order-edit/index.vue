<template>
  <div class="edit">
    <order-detail :type="1" @save="setSavedData" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import OrderDetail from '@/components/order-detail'

export default {
  components: {
    OrderDetail
  },

  beforeRouteEnter(to, from, next) {
    if (from.path !== '/order/list/main' && from.path !== '/order/list/upload') {
      return next('/order/list')
    }
    next()
  },

  methods: {
    ...mapMutations({
      updatePreviewData: 'template/UPDATE_PREVIEWDATA'
    }),

    setSavedData(data) {
      // this.renderData = data
      this.updatePreviewData(data)
      this.$message.success('保存成功')
      // 切换到预览页
      setTimeout(() => {
        this.$router.push('/order/list/upload')
      }, 1000)
    }
  }
}
</script>

<style lang="scss">
.edit {
  padding: 30px;
}
</style>
