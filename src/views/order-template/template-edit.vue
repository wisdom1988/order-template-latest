<template>
  <div class="edit-wrap">
    <div class="edit-type">{{ type === 2 ? '新建模板' : '编辑模板' }}</div>
    <div class="edit-btn">
      <el-button type="primary" size="mini" @click="saveTemplate">保存</el-button>
      <el-button type="primary" size="mini">取消</el-button>
      <el-button v-if="type === 3" type="primary" size="mini">删除</el-button>
    </div>
    <el-form :model="formData" ref="title" label-width="100px" inline class="edit-title">
      <el-form-item
        label="模板名称"
        prop="title"
        :rules="{ required: true, message: '模板名称不能为空'}"
      >
        <el-input v-model.trim="formData.title"></el-input>
      </el-form-item>
    </el-form>
    <div class="edit">
      <div class="edit-block">工单参数</div>
      <template-block ref="orderBlock" :block-data="orderData" />
    </div>
    <div class="edit">
      <div class="edit-block">生产参数</div>
      <template-block ref="proBlock" :block-data="productData" />
    </div>
    <div class="edit">
      <div class="edit-block">自动化</div>
      <template-block ref="autoBlock" :block-data="automaticData" />
    </div>
  </div>
</template>

<script>
import { deepCopy } from '@/utils'
import TemplateBlock from './template-block-new'

export default {
  name: 'TemplateEdit',
  components: { TemplateBlock },
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
      formData: null,
      // title: '',
      orderData: [],
      productData: [],
      automaticData: []
    }
  },
  watch: {
    templateContent: {
      handler(val) {
        if (val.tempId) {
          const params = deepCopy(val.params)
          this.formData = {
            ...val,
            params,
          }
          this.splitParams(params)
          return
        }
        this.formData = {
          title: '',
          icon: '',
          params: []
        }
        this.orderData.push({
          name: '客户',
          nameLength: null,
          contentLength: null,
          showType: null,
          row: null,
          col: null,
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
    saveTemplate() {
      const orderRes = this.$refs.orderBlock.saveBlockData()
      const proRes = this.$refs.proBlock.saveBlockData()
      const autoRes = this.$refs.proBlock.saveBlockData()
      this.$refs.title.validate((valid) => {
        if (valid && orderRes && proRes && autoRes) {
          this.formData.params = [...this.orderData, ...this.productData, ...this.automaticData]
          console.log(this.formData)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-form-item__label {
  text-align: left;
  font-size: 18px;
}
.el-form-item {
  margin-bottom: 10px;
}
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
