<template>
  <div>
    <table>
      <tbody>
        <tr class="edit-block-head">
          <td>字段名</td><td>字段名长度</td><td>字段内容长度</td><td>类型</td><td>字段名位置/行</td><td>字段名位置/列</td><td />
        </tr>
        <tr
          v-for="(item, index) in blockData"
          :key="`${item.col}${item.row}${index}`"
        >
          <td class="edit-name">
            <input v-if="!item.isCustom" v-model="item.name" type="text">
            <span v-else>{{ item.name }}</span>
          </td>
          <td>
            <select v-model="item.nameLength">
              <option
                v-for="number in cell"
                :key="number"
                :value="number"
              >{{ number }}</option>
            </select>
          </td>
          <td>
            <select v-model="item.contentLength">
              <option
                v-for="number in cell"
                :key="number"
                :value="number"
              >{{ number }}</option>
            </select>
          </td>
          <td class="edit-type">
            <select v-model="item.showType">
              <option value="1">文本框</option>
              <option value="2">下拉框</option>
            </select>
          </td>
          <td class="edit-row">
            <input v-model="item.row" type="number">
          </td>
          <td class="edit-col">
            <input v-model="item.col" type="number">
          </td>
          <td class="edit-operate">
            <span @click="openDialog(item)">选项</span>
            <span v-if="!item.isCustom">删除</span>
          </td>
        </tr>
        <div
          class="edit-plus"
          @click="addParams()"
        >
          <i class="el-icon-plus" />
        </div>
      </tbody>
    </table>
    <el-dialog class="pulldown" :visible.sync="pulldownTableVisible">
      <div class="pulldown-head">
        <strong>字段名</strong>
        <el-button type="primary" size="mini" @click="savePulldownData">保存</el-button>
        <el-button type="primary" size="mini" @click="pulldownTableVisible = false">取消</el-button>
      </div>
      <el-table :data="pulldownData">
        <el-table-column prop="text" label="预选字段" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.text" />
          </template>
        </el-table-column>
        <el-table-column label="默认字段" width="100" center>
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isDefault" />
          </template>
        </el-table-column>
        <el-table-column label="">
          <template slot-scope="scope">
            <el-button type="text" @click="deletePulldownData(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div
        class="edit-plus"
        @click="addPulldownData"
      >
        <i class="el-icon-plus" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    blockData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      pulldownTableVisible: false,
      textTableVisible: false,
      cell: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      paramTemp: {
        name: '',
        nameLength: 0,
        contentLength: 0,
        showType: 0,
        row: 0,
        col: 0,
        option: null
      },
      pulldownData: [],
      textData: ''
    }
  },
  methods: {
    addParams() {
      this.blockData.push({ ...this.paramTemp })
    },
    openDialog(item) {
      if (!item.showType) {
        this.$message({
          message: '请选择字段类型',
          type: 'warning'
        })
        return
      }
      if (item.showType === 1) {
        this.textData = item.option || ''
        this.textTableVisible = true
      } else {
        this.pulldownData = item.option || [{ text: '', isDefault: false }]
        item.option = this.pulldownData
        this.pulldownTableVisible = true
      }
    },
    addPulldownData() {
      this.pulldownData.push({
        text: '',
        isDefault: false
      })
    },
    deletePulldownData(data) {
      this.pulldownData.splice(data.$index, 1)
    },
    savePulldownData() {
      if (!this.pulldownData.length) {
        return this.$message({
          message: '请填写下拉框选项',
          type: 'warning'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-input__inner {
  height: 28px;
  line-height: 28px;
}
/deep/ .el-dialog__body {
  padding: 15px;
}
/deep/ .el-table {
  td {
    padding: 0;
    border-bottom: 0
  }
}
.edit {
  &-block {
    &-head {
      line-height: 24px;
    }
  }
  td {
      padding-right: 15px;
  }
  &-name {
    input {
      width: 180px
    }
    span {
      display: inline-block;
      min-width: 80px;
    }
  }
  &-type {
    select {
      width: 80px;
    }
  }
  &-row, &-col {
    input {
      width: 100px;
    }
  }
  &-operate {
    color: #409EFF;
    span {
      cursor: pointer;
    }
    span:first-child {
      margin-right: 5px;
    }
  }
  &-plus {
    margin-top: 20px;
    border: 1px solid #606266;
    width: 30px;
    height: 30px;
    text-align: center;
    cursor: pointer;
    i {
      margin-top: 5px;
    }
  }
}
.pulldown {
  &-head {
    padding-left: 10px;
    strong {
      margin-right: 20px;
      display: inline-block;
      font-size: 18px;
      line-height: 28px;
    }
  }
  .edit-plus {
    margin-left: 10px;
    i {
      margin-top: 7px;
    }
  }
}
</style>
