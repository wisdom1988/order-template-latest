<template>
  <div class="edit-wrap">
    <div class="edit-type">{{ type === 2 ? '新建模板' : '编辑模板' }}</div>
    <div class="edit-btn">
      <el-button type="primary" size="mini">保存</el-button>
      <el-button type="primary" size="mini">取消</el-button>
      <el-button v-if="type === 3" type="primary" size="mini">删除</el-button>
    </div>
    <div class="edit-title">
      <label>模板名称：<input type="text"></label>
    </div>
    <div class="edit">
      <div class="edit-block">工单参数</div>
      <template-block :block-data="orderData" />
    </div>
    <div class="edit">
      <div class="edit-block">生产参数</div>
      <template-block :block-data="productData" />
    </div>
    <div class="edit">
      <div class="edit-block">自动化</div>
      <template-block :block-data="automaticData" />
    </div>
  </div>
</template>

<script>
import { deepCopy } from '@/utils'
import TemplateBlock from './template-block'

export default {
  name: 'TemplateEdit',
  components: {TemplateBlock},
  props: {
    type: {
      type: Number,
      required: true
    },
    templateContent: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      title: '',
      orderData: [],
      productData: [],
      automaticData: [],
    }
  },
  watch: {
    templateContent: {
      handler(val) {
        if (val.tempId) {
          const params = deepCopy(val.params)
          this.title = val.title
          this.splitParams(params)
          return
        }
        this.orderData.push({
          name: '客户',
          nameLength: null,
          contentLength: null,
          showType: 0,
          row: 0,
          col: 0,
          isCustom: true
        })
      },
      immediate: true
    }
  },
  methods: {
    splitParams(params) {
      params.forEach((item) => {
        if (item.type === 1) {
          return this.orderData.push(item)
        }
        if (item.type === 2) {
          return this.productData.push(item)
        }
        this.automaticData.push(item)
      })
    },

    plusParams(attr) {
      this[attr].push({...this.paramTemp})
    }
  }
}
</script>

<style lang="scss" scoped>
.edit {
  margin-top: 15px;
  &-type, &-btn {
    display: inline-block;
    vertical-align: middle;
  }
  &-type {
    font-size: 24px;
    line-height: 30px;
  }
  &-btn {
    margin-left: 30px;
  }
  &-title {
    margin-top: 20px;
  }
  &-block {
    margin-bottom: 10px;
    background: #ccc;
    line-height: 24px;
  }
}
</style>
