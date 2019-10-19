<template>
  <div class="detail-wrap">
    <div class="detail-intro">参数</div>
    <div class="detail">
      <div
        v-for="(item, key) in renderData"
        :key="key"
        class="detail-block"
      >
        <div class="detail-block-type">{{ key | formatType }}</div>
        <div class="detail-block-table">
          <div
            v-for="(field, row) in item"
            :key="row"
            class="detail-block-table-row"
          >
            <div
              v-for="(content, index) in field"
              :key="index"
              class="option"
              :class="`flex-${content.length}`"
            >
              <div v-if="index % 2 === 0" class="option-name">
                <span>{{ content.name }}</span>
              </div>
              <el-input v-else-if="content.showType === 1" v-model.trim="content.value" placeholder="请输入内容" />
              <el-select v-else v-model="content.value" placeholder="请选择">
                <el-option
                  v-for="option in content.option"
                  :key="option.text"
                  :label="option.text"
                  :value="option.text"
                />
              </el-select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="detail-btn">
      <el-button type="primary" plain @click="resetData">重置</el-button>
      <el-button type="primary" @click="submitOrder">提交</el-button>
    </div>
  </div>
</template>

<script>
import { deepCopy, flatArr } from '@/utils'
import { getUserId } from '@/utils/auth'
import { addOrder } from '@/api/manage'

export default {
  filters: {
    formatType(val) {
      if (val === '1') return '工单参数'
      if (val === '2') return '生产参数'
      if (val === '3') return '自定义参数'
    }
  },

  props: {
    type: {
      type: Number, // 0 新建 1 编辑
      required: true
    },
    templateData: {
      type: Object,
      default: () => {}
    },
    tempId: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      // originData: {},
      renderData: {}
    }
  },

  computed: {
    originData() {
      return deepCopy(this.templateData)
    }
  },

  watch: {
    templateData: {
      handler(val) {
        this.renderData = deepCopy(val)
      },
      immediate: true
    }
    // templateData: {
    //   handler(val) {
    //     this.renderData = deepCopy(val)
    //     const keys = Object.keys(this.renderData)
    //     Object.values(this.renderData).forEach((option, i) => {
    //       const arr = []
    //       option.forEach((item) => {
    //         const value = this.getDefaultValue(item)
    //         item.value = item.value || value
    //         item.length = item.nameLength
    //         if (!arr[item.row - 1]) {
    //           arr[item.row - 1] = [item]
    //         } else {
    //           arr[item.row - 1].push(item)
    //         }
    //         const copiedValueItem = { ...item, length: item.contentLength }
    //         arr[item.row - 1].push(copiedValueItem)
    //       })
    //       this.renderData[keys[i]] = arr
    //     })
    //     this.originData = deepCopy(this.renderData)
    //   },
    //   immediate: true
    // }
  },

  methods: {
    getDefaultValue(item) {
      if (item.showType === 1) {
        return item.option
      }
      let value
      item.option.some((v) => {
        if (v.isDefault) {
          value = v.text
          return true
        }
      })
      return value
    },
    resetData() {
      this.renderData = deepCopy(this.originData)
    },
    validateData(orderDetail) {
      let jobName
      let client
      const valid = orderDetail.every((item) => {
        if (item.type !== 1) return true
        if (item.name === '客户') {
          if (item.value) {
            client = item.value
            return true
          } else {
            return void this.$message.error("请填写工单参数的'客户'项")
          }
        }
        if (item.name === '工单号') {
          if (item.value) {
            jobName = item.value
            return true
          } else {
            return void this.$message.error("请填写工单参数的'工单号'项")
          }
        }
        return true
      })
      return {
        valid,
        client,
        jobName
      }
    },
    submitOrder() {
      const doubleData = flatArr(Object.values(this.renderData))
      const orderDetail = []
      doubleData.forEach((item, index) => {
        if (index % 2 === 0) return
        // eslint-disable-next-line
        const { length, ...res } = item
        orderDetail.push(res)
      })
      const { valid, client, jobName } = this.validateData(orderDetail)
      if (!valid) return
      const reqData = {
        jobName,
        client,
        orderDetail,
        tempId: +this.tempId,
        userId: +getUserId()
      }
      console.log(reqData)
      // 发送创建/编辑工单的请求，后跳转至预览+上传附件页面
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      addOrder(reqData).then((data) => {
        this.$emit('save', this.renderData)
        loading.close()
      }).catch(() => {
        loading.close()
      })
    }
  }
}
</script>

<style lang="scss">
.el-input {
  .el-input__inner {
    width: 100%;
    line-height: 32px;
    height: 32px;
  }
}
.flex-1 {
  flex: 1;
}
.flex-2 {
  flex: 2;
}
.flex-3 {
  flex: 3;
}
.flex-4 {
  flex: 4;
}
.flex-5 {
  flex: 5;
}
.flex-6 {
  flex: 6;
}
.flex-7 {
  flex: 7;
}
.flex-8 {
  flex: 8;
}
.flex-9 {
  flex: 9;
}
.flex-10 {
  flex: 10;
}
.detail {
  &-intro {
    margin-bottom: 15px;
    font-size: 16px;
    color: #4A5470;
    font-weight: 600;
    line-height: 22px;
  }

  &-block {
    margin-bottom: 24px;
    background: #fff;
    &-type {
      padding: 16px 32px;
      font-size: 16px;
      color: #4A5470;
      line-height: 24px;
      font-weight: 600;
      border-bottom: 1px solid #E9E9E9;
    }
    &-table {
      width: 100%;
      padding: 24px 36px 23px;
      &-row {
        margin-bottom: 30px;
        display: flex;
        flex-wrap: nowrap;
      }
      &-row:last-child {
        margin-bottom: 0;
      }
    }
  }
  .option {
    &-name {
      padding-right: 12px;
      text-align: right;
      font-size: 14px;
      color: #4A5470;
      span {
        display: inline-block;
        line-height: 32px;
      }
    }
  }
  &-btn {
    margin-top: 40px;
    text-align: center;
    .el-button {
      width: 113px;
    }
    .el-button+.el-button {
      margin-left: 20px;
    }
  }
}
</style>
