<template>
  <div class="order-wrap">
    <div class="order">
      <el-form ref="form" :model="form" inline label-width="80px">
        <el-form-item label="客户名">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="工单日期">
          <el-col :span="11">
            <el-date-picker v-model="form.date1" type="date" placeholder="开始日期" style="width: 100%;" />
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-date-picker v-model="form.date2" placeholder="结束日期" style="width: 100%;" />
          </el-col>
        </el-form-item>
        <el-form-item label="工单号">
          <el-input v-model="form.id" />
        </el-form-item>
        <el-form-item label="排序">
          <el-select v-model="form.row" placeholder="请选择排序条件">
            <el-option label="创建时间" :value="1" />
            <el-option label="工单号" :value="2" />
            <el-option label="客户名" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item class="order-handle">
          <el-button type="primary" size="small" icon="el-icon-search" class="order-search" @click="onSubmit">搜索</el-button>
          <el-button type="text" size="small">清空筛选条件</el-button>
          <el-button class="order-handle-add" type="primary" size="small" icon="el-icon-plus" @click="$router.push('/order/add')">新建工单</el-button>
        </el-form-item>
      </el-form>
      <div class="order-table">
        <el-table
          ref="multipleTable"
          :data="orderList"
          style="width: 100%"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
          />
          <el-table-column
            label="工单号"
          >
            <template slot-scope="scope">{{ scope.row.id }}</template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="客户名"
          />
          <el-table-column
            prop="createdTime"
            label="创建时间"
            show-overflow-tooltip
          />
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" style="color:#F56C6C;" @click="preview(scope.row)">预览</el-button>
              <el-button type="text" size="small" @click="deleteOne(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="text">批量删除</el-button>
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="orderList.length"
          class="order-pagination"
        />
      </div>
    </div>
    <div class="order-preview">
      <preview />
    </div>
  </div>
</template>

<script>
import Preview from '@/components/preview'

export default {
  components: {
    Preview
  },

  data() {
    return {
      form: {
        name: '',
        date1: '',
        date2: '',
        id: '',
        row: 1
      },
      orderList: [],
      currentPage: 1,
      pageSize: 10
    }
  },

  created() {
    this.orderList = [{
      id: 123,
      name: 'halo',
      createdTime: 1570112816401
    }]
  },

  methods: {
    onSubmit() {},
    handleSelectionChange(val) {},
    preview(data) {},
    deleteOne(data) {},
    jump() {
      this.$router.replace({ path: '/order/add' })
    }
  }
}
</script>

<style lang="scss">
.el-form-item {
  margin-bottom: 15px;
}
.el-form-item__label,
.el-form-item__content,
.el-input__icon {
  line-height: 36px;
}
.el-input__inner {
  height: 36px;
  width: 190px;
}
.el-table {
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
  width: 50%;
  background: #fff;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, .1);
  &-handle {
    width: 100%;
    .el-form-item__content {
      display: block;
    }
    &-add {
      margin-top: 2px;
      margin-right: 10px;
      float: right;
    }
  }
  &-wrap {
    display: flex;
    min-width: 1180px;
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
    flex: 1
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
  &-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 0;
  }
}
</style>
