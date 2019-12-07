<template>
  <div class="app-container">
    <template-list
      v-if="type === 1"
      :template-list="templateList"
      :total="totol"
      :page="page"
      @edit="changeType"
      @page="changePage"
    />
    <template-edit v-if="type === 2 || type === 3" :type="type" :template-content="templateContent" @edit="changeType" />
  </div>
</template>

<script>
import TemplateList from './template-list'
import TemplateEdit from './template-edit'
import { getTemplateList } from '@/api/manage'

export default {
  name: 'OrderTemplate',
  components: {
    TemplateList,
    TemplateEdit
  },
  data() {
    return {
      number: 10,
      totol: 0,
      page: 1,
      type: 1, // 1 所有工单模板 2 工单模板新建 3 工单模板编辑
      templateList: [],
      templateContent: {}
    }
  },
  watch: {
    type(val) {
      if (val === 1) {
        this.getList()
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const { page, number } = this
      getTemplateList({ page, number }).then((data) => {
        this.totol = data.total
        this.templateList = data.list
        loading.close()
      }).catch(() => {
        this.templateList = []
        loading.close()
      })
    },
    changePage(page) {
      this.page = page
      this.getList()
    },
    changeType(type, item) {
      this.type = type
      this.templateContent = item || {}
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
