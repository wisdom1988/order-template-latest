<template>
  <div class="preview-wrap">
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
    <div v-if="showBtns" class="preview-btn">
      <el-button type="primary" size="small" plain @click="upload">文件</el-button>
      <el-button type="primary" size="small" plain @click="editOrder">编辑</el-button>
      <el-button type="primary" size="small" plain>打印</el-button>
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
      previewData: ({ template }) => template.previewData
    })
  },

  methods: {
    ...mapMutations({
      updateEditData: 'template/UPDATE_EDITDATA'
    }),
    editOrder() {
      const valid = Object.keys(this.previewData)
      if (!valid.length) {
        // return this.$message({
        //   message: '请先点击"预览"需要编辑的工单',
        //   type: 'warn'
        // })
        return this.$message.error('请先点击"预览"需要编辑的工单')
      }
      this.updateEditData(this.previewData)
      this.$router.push('/order/list/edit')
    },
    upload() {
      // 临时
      this.$router.push('/order/list/upload')
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
    line-height: 18px;
    // &-name {
    //   span {
    //     display: inline-block;
    //     line-height: 32px;
    //   }
    // }
    &:nth-child(2n) {
      padding-left: 4px;
      text-align: left;
    }
  }

	&-btn {
		margin-top: 30px;
		text-align: center;
	}
}
</style>
