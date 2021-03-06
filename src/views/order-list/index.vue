<template>
  <div class="order-wrap">
    <div class="order">
      <el-form ref="form" :model="form" inline label-width="80px">
        <el-form-item label="客户名称">
          <el-input v-model="form.client" />
        </el-form-item>
        <el-form-item label="工单编号">
          <el-input v-model="form.jobName" />
        </el-form-item>
        <el-form-item label="排序方式">
          <el-select v-model="form.sort" placeholder="请选择排序条件">
            <el-option label="创建时间" :value="1" />
            <el-option label="工单编号" :value="2" />
            <el-option label="客户名称" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="工单日期">
          <el-col :span="11">
            <el-date-picker v-model="form.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始日期" style="width: 100%;" />
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-date-picker
              v-model="form.endTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="结束日期"
              style="width: 100%;"
            />
          </el-col>
        </el-form-item>
        <el-form-item class="order-handle">
          <el-button type="primary" size="small" icon="el-icon-search" class="order-search" @click="onSubmit">搜索</el-button>
          <el-button type="text" size="small" @click="resetSearch">清空筛选条件</el-button>
          <div class="order-handle-btns">
            <el-button class="order-handle-add" type="primary" size="small" icon="el-icon-plus" @click="$router.push('/order/list/add')">新建工单</el-button>
            <el-button type="primary" size="small" plain @click="$refs.preview.upload()">上传</el-button>
            <el-button type="primary" size="small" plain @click="$refs.preview.editOrder()">编辑</el-button>
            <el-button type="primary" size="small" plain @click="$refs.preview.print()">打印</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div class="order-table">
        <el-table
          ref="multipleTable"
          :data="orderList"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          @row-click="preview"
        >
          <el-table-column
            type="selection"
            width="60px"
          />
          <el-table-column
            label="工单编号"
          >
            <template slot-scope="scope">{{ scope.row.jobName }}</template>
          </el-table-column>
          <el-table-column
            prop="client"
            label="客户名称"
          />
          <el-table-column
            prop="createTime"
            label="创建时间"
            show-overflow-tooltip
          />
          <el-table-column
            label="操作"
            width="170"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" style="color:#F56C6C;" @click="preview(scope.row, true)">全屏预览</el-button>
              <el-button type="text" size="small" @click="copyOne(scope.row)">复制</el-button>
              <el-button type="text" size="small" @click="deleteOne(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="text" @click="deleteMult">批量删除</el-button>
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page="currentPage"
          :page-size="20"
          :total="total"
          @current-change="changePage"
          class="order-pagination"
        />
      </div>
    </div>
    <div class="order-preview" :class="{print: isPrint}">
      <div class="order-preview-wrap" :class="{print: isPrint}">
        <preview ref="preview" :show-btns="false" />
      </div>
    </div>
     <fullscreen-preview :fullscreen="fullscreen" @close="fullscreen = false" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Preview from '@/components/preview'
import FullscreenPreview from '@/components/fullscreen-preview'
import { getOrderList, deleteOrder, copyOrder } from '@/api/manage'
import { formatOrderDetail } from '@/utils'

export default {
  components: {
    Preview,
    FullscreenPreview
  },

  data() {
    return {
      fullscreen: false,
      form: {
        client: '',
        startTime: '',
        endTime: '',
        jobName: '',
        sort: 1
      },
      orderList: [],
      currentPage: 1,
      pageSize: 20,
      total: 0,
      selectOrder: []
    }
  },

  created() {
    this.updatePreviewData({})
    this.getOrderList()
  },

  computed: {
    ...mapState({
      userId: ({ user }) => user.userId,
      isPrint: ({ template }) => template.isPrint
    })
  },

  methods: {
    ...mapMutations({
      updatePreviewData: 'template/UPDATE_PREVIEWDATA',
      updateJobId: 'template/UPDATE_JOBID',
      updateJobName: 'template/UPDATE_JOBNAME',
      updateTempId: 'template/UPDATE_TEMPID',
      updateSavePath: 'template/UPDATE_SAVEPATH',
      updateTaskId: 'template/UPDATE_TASKID'
    }),
    getOrderList() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const reqData = {
        page: this.currentPage,
        userId: this.userId,
        ...this.form
      }
      getOrderList(reqData).then((data) => {
        data.list.forEach((order) => {
          order.detail = formatOrderDetail(order.detail, order.jobName)
        })
        this.orderList = data.list
        this.total = data.total
        loading.close()
      }).catch(() => {
        this.orderList = []
        loading.close()
      })
    },
    changePage(page) {
      this.currentPage = page
      this.getOrderList()
    },
    resetSearch() {
      this.form = {
        client: '',
        startTime: '',
        endTime: '',
        jobName: '',
        sort: 1
      }
    },
    onSubmit() {
      this.currentPage = 1
      this.getOrderList()
    },
    handleSelectionChange(val) {
      this.selectOrder = val
    },
    preview(data, showFullPreview) {
      this.updatePreviewData(data.detail)
      this.updateJobId(data.id)
      this.updateJobName(data.jobName)
      this.updateTempId(data.tempId)
      this.updateSavePath(data.savePath)
      this.updateTaskId(data.taskId)
      if (showFullPreview === true) {
        this.fullscreen = true
      }
    },
    deleteOrder(message, data) {
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          deleteOrder(data).then(() => {
            this.$message.success('删除成功')
            loading.close()
            setTimeout(() => {
              this.currentPage = 1
              this.getOrderList()
            }, 500)
          }).catch(() => {
            loading.close()
          })
        }).catch(() => {})
    },
    deleteOne(data) {
      this.deleteOrder('确定要删除本条工单吗？', { ids: [data.id] })
    },
    deleteMult() {
      if (!this.selectOrder.length) {
        return this.$message.error('请勾选需要删除的工单')
      }
      const ids = this.selectOrder.map(item => {
        return item.id
      })
      this.deleteOrder('确定要删除所有选中工单吗？', { ids })
    },
    copyOne(data) {
      this.$confirm('', '确定要复制当前工单吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      }).then(() => {
        copyOrder(data.id).then(() => {
          this.$message.success(`复制成功,工单编号为：${data.jobName}复制`)
          this.currentPage = 1
          this.getOrderList()
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-table__row:hover {
  cursor: pointer;
}
/deep/ .el-form-item {
  margin-bottom: 15px;
}
/deep/ .el-form-item__label,
/deep/ .el-form-item__content,
/deep/ .el-input__icon {
  line-height: 36px;
}
/deep/ .el-input__inner {
  height: 36px;
}
/deep/ .el-input__suffix {
  right: 0;
}
/deep/ .el-table {
  th {
    padding: 6px;
    font-weight: 500;
  }
  td {
    padding: 0 6px;
  }
}
.order {
  padding: 20px 10px 20px 10px;
  // flex: 1;
  width: 55%;
  background: #fff;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, .1);
  &-handle {
    width: 100%;
    /deep/ .el-form-item__content {
      display: block;
    }
    &-btns {
      margin-top: 2px;
      margin-right: 10px;
      float: right;
    }
  }
  &-wrap {
    display: flex;
    min-height: 100%;
    overflow: auto;
  }
  &-search {
    margin-left: 10px;
  }
  &-table {
    margin-top: 15px;
    margin-left: 10px;
  }
  &-preview {
    position: fixed;
    top: 90px;
    left: 55%;
    right: 20px;
    width: 45%;
    height: calc(100% - 90px);
    overflow: auto;
    padding: 40px;
    &-wrap {
      height: calc((45vw - 80px) * 1.5);
    }
    &.print {
      position: static;
    }
  }
  label {
    font-weight: 500
  }
  .line {
    padding-left: 10px;
    text-align: center
  }
  &-pagination {
    margin-top: 10px;
    float: right;
  }
}
</style>
