<template>
  <div class="add">
    <template-list @choose="chooseTemplate" />
    <div class="add-order">
      <order-detail :type="0" :temp-id="tempId" @save="setSavedData" />
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import TemplateList from './template-list'
import OrderDetail from '@/components/order-detail'

export default {
  components: {
    TemplateList,
    OrderDetail
  },

  data() {
    return {
      // templateData: {}, // {1: [], 2: [], 3:[]} 工单/生产/自定义参数三部分的格式化数据
      tempId: null
      // renderData: null
    }
  },

  methods: {
    ...mapMutations({
      updatePreviewData: 'template/UPDATE_PREVIEWDATA'
    }),
    chooseTemplate(item, tempId) {
      // this.templateData = item
      this.tempId = tempId
    },

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
.add {
  display: flex;
  height: 100%;
  &-order {
    padding: 11px 24px 0;
    flex: 1;
    height: 100%;
    overflow: auto;
  }
}
</style>
