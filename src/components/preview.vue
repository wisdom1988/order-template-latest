<template>
  <div class="preview-wrap" :class="{print: isPrint}" >
    <div v-if="showBtns" class="preview-btn">
      <el-button v-if="$route.path === '/order/list/main'" type="primary" size="small" plain @click="upload">文件</el-button>
      <el-button v-if="$route.path === '/order/list/upload'" type="primary" size="small" plain @click="$router.push('/order/list/main')">返回</el-button>
      <el-button type="primary" size="small" plain @click="editOrder">编辑</el-button>
      <el-button type="primary" size="small" plain @click="print">打印</el-button>
    </div>
    <div class="preview" @click="$emit('click')">
      <h5 class="preview-title">生产施工单</h5>
      <div
        v-for="(item, key) in previewData"
        :key="key"
        class="preview-block"
      >
        <div class="preview-block-type">{{ key | formatType }}</div>
        <div class="preview-block-table">
          <div
            v-for="(field, row) in item"
            :key="row"
            class="preview-block-table-row"
          >
            <div
              v-for="(content, index) in field"
              :key="index"
              class="option"
              :class="`flex-${content.length}`"
            >
              <span v-if="index % 2 === 0" class="option-name">{{ content.name }}</span>
              <span v-else>{{ content.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  filters: {
    formatType(val) {
      if (val === '1') return '工单参数'
      if (val === '2') return '生产参数'
      if (val === '3') return '自定义参数'
    }
  },

  props: {
    showBtns: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    ...mapState({
      previewData: ({ template }) => template.previewData,
      isPrint: ({ template }) => template.isPrint
    }),
    canHandle() {
      const valid = Object.keys(this.previewData)
      return !!valid.length
    }
  },

  methods: {
    ...mapMutations({
      updateEditData: 'template/UPDATE_EDITDATA',
      updateIsPrint: 'template/UPDATE_ISPRINT'
    }),
    editOrder() {
      if (!this.canHandle) return this.$message.error('请先点击需要上传文件的工单行')
      this.updateEditData(this.previewData)
      this.$router.push('/order/list/edit')
    },
    upload() {
      if (!this.canHandle) return this.$message.error('请先点击需要上传文件的工单行')
      this.$router.push('/order/list/upload')
    },
    print() {
      if (!this.canHandle) return this.$message.error('请先点击需要上传文件的工单行')
      this.updateIsPrint(true)
      this.$nextTick(() => {
        window.print()
        setTimeout(() => {
          this.updateIsPrint(false)
        })
      })
    }
  }
}
</script>

<style lang="scss">
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
h5 {
	margin: 0;
	padding: 0;
}
.preview {
  flex: 1;
	padding: 20px 30px;
	border: 1px solid #E7EAEF;
  box-shadow: -3px -3px 9px 0 rgba(23,63,126,0.10), 3px 3px 9px 0 rgba(23,63,126,0.10);
	background: #fff;
	text-align: center;
	h5 {
		margin-bottom: 25px;
		font-weight: 500;
	}
	&-wrap {
		display: flex;
    flex-direction: column;
    height: 100%;
	}

  &-block {
    margin-bottom: 24px;
    background: #fff;
    &-type {
      margin-bottom: 5px;
      text-align: left;
      font-size: 12px;
      line-height: 18px;
    }
    &-table {
      width: 100%;
      border-top: 1px solid #000;
      border-left: 1px solid #000;
      &-row {
        display: flex;
        flex-wrap: nowrap;
      }
      &-row:last-child {
        margin-bottom: 0;
      }
    }
  }
  .option {
    border-right: 1px solid #000;
    border-bottom: 1px solid #000;
    font-size: 12px;
    line-height: 24px;
    &:nth-child(2n) {
      padding-left: 4px;
      text-align: left;
    }
  }

	&-btn {
    margin-bottom: 40px;
		text-align: center;
	}
}

.order-preview-wrap.print,
.preview-wrap.print {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  padding: 60px 40px;
  background: #fff;
  .preview {
    border: none;
    padding: 0;
    box-shadow: none;
    font-size: 24px;
    line-height: 42px;
  }
  .preview-btn {
    display: none;
  }
}
</style>
