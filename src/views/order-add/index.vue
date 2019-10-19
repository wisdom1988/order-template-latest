<template>
  <div class="add">
    <!-- <template-list :template-list="templateList" @scroll="getMoreTemp" @choose="chooseTemplate" /> -->
    <template-list @choose="chooseTemplate" />
    <div class="add-order">
      <order-detail :type="0" :template-data="templateData" :temp-id="tempId" @save="setSavedData" />
    </div>
  </div>
</template>

<script>
// import { getTemplateList } from '@/api/manage'
import TemplateList from './template-list'
import OrderDetail from '@/components/order-detail'
// import { formatOrderDetail } from '@/utils'

export default {
  components: {
    TemplateList,
    OrderDetail
  },

  data() {
    return {
      // page: 1,
      // number: 10,
      // pageTotal: null,
      // templateList: [],
      // isLoading: false,
      templateData: {}, // {1: [], 2: [], 3:[]} 工单/生产/自定义参数三部分的格式化数据
      tempId: null,
      savedData: null
    }
  },

  created() {
    // this.getTemplateList()
  },

  methods: {
    // getTemplateList() {
    //   const loading = this.$loading({
    //     lock: true,
    //     text: 'Loading',
    //     spinner: 'el-icon-loading',
    //     background: 'rgba(0, 0, 0, 0.7)'
    //   })
    //   const { page, number } = this
    //   getTemplateList({ page, number }).then((data) => {
    //     console.log('list', data.list)
    //     this.pageTotal = data.pageTotal
    //     data.list.forEach((item) => {
    //       item.params = formatOrderDetail(item.params)
    //     })
    //     this.templateList = data.list
    //     this.templateData = data.list[0].params
    //     this.tempId = data.list[0].tempId
    //     loading.close()
    //   }).catch(() => {
    //     loading.close()
    //   })
    // },

    // getMoreTemp() {
    //   const { page, number, pageTotal } = this
    //   const reqPage = page + 1
    //   if (reqPage > pageTotal || this.isLoading) return
    //   this.isLoading = true
    //   getTemplateList({ page: reqPage, number }).then((data) => {
    //     this.totol = data.total
    //     this.templateList = this.templateList.concat(data.list)
    //     console.log(data.list)
    //     this.page++
    //     this.isLoading = false
    //   }).catch(() => {
    //     this.isLoading = false
    //   })
    // },

    chooseTemplate(item, tempId) {
      this.templateData = item
      this.tempId = tempId
    },

    setSavedData(data) {
      this.savedData = data
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
