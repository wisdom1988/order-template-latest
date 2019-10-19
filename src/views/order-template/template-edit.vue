<template>
  <div class="edit-wrap">
    <div class="edit-type">{{ type === 2 ? '新建模板' : '编辑模板' }}</div>
    <div class="edit-btn">
      <el-button type="primary" size="mini" @click="saveTemplate">保存</el-button>
      <el-button type="primary" size="mini" @click="$emit('edit', 1)">取消</el-button>
      <el-button v-if="type === 3" type="primary" size="mini" @click="deleteTemplate">删除</el-button>
    </div>
    <el-form ref="title" :model="formData" label-width="100px" inline class="edit-title">
      <el-form-item
        label="模板名称"
        prop="title"
        :rules="{ required: true, message: '模板名称不能为空' }"
      >
        <el-input v-model.trim="formData.title" />
      </el-form-item>
    </el-form>
    <div class="edit">
      <div class="edit-block">工单参数</div>
      <template-block ref="orderBlock" :block-data="orderData" :type="1" />
    </div>
    <div class="edit">
      <div class="edit-block">生产参数</div>
      <template-block ref="proBlock" :block-data="productData" :type="2" />
    </div>
    <div class="edit">
      <div class="edit-block">自动化</div>
      <template-block ref="autoBlock" :block-data="automaticData" :type="3" />
    </div>
  </div>
</template>

<script>
import { deepCopy } from '@/utils'
import { deleteTemplate, addTemplate, editTemplate } from '@/api/manage'
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
          params.forEach((item) => {
            if (item.type === 1 && (item.name === '客户' || item.name === '工单号')) {
              item.isRequired = true
            }
          })
          this.formData = {
            ...val,
            params
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
          isRequired: true,
          type: 1
        })
        this.orderData.push({
          name: '工单号',
          nameLength: null,
          contentLength: null,
          showType: null,
          row: null,
          col: null,
          isRequired: true,
          type: 1
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
          // 保存模板请求
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          const reqName = this.type === 2 ? addTemplate : editTemplate
          reqName(this.formData).then(() => {
            loading.close()
            this.$message.success('保存成功')
            setTimeout(() => {
              this.$emit('edit', 1)
            }, 1000)
          }).catch(() => {
            loading.close()
          })
        }
      })
    },
    deleteTemplate() {
      this.$confirm('确定删除此模板吗?', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        deleteTemplate(this.templateContent.tempId)
          .then((data) => {
            loading.close()
            this.$message.success('删除成功')
            this.$emit('edit', 1)
          })
          .catch(() => {
            loading.close()
          })
      }).catch(() => {})
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
