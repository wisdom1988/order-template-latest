<template>
  <div class="block">
    <el-form ref="form" :model="model">
      <el-table ref="table" :data="model.tableData">
        <el-table-column label="字段名">
          <template slot-scope="scope">
            <span v-if="scope.row.isRequired" class="block-custom">{{ scope.row.name }}</span>
            <el-form-item
              v-else
              :prop="'tableData.' + scope.$index + '.name'"
              :rules="{required: true, trigger: 'blur', validator: checkDouble}"
            >
              <el-input
                v-model.trim="scope.row.name"
                @click="doubleNameCheck(scope.$index, scope.row.name)"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="字段名长度">
          <template slot-scope="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.nameLength'"
              :rules="{ required: true, message: '请选择字段名长度', trigger: 'change' }"
            >
              <el-select v-model="scope.row.nameLength" placeholder="请选择">
                <el-option
                  v-for="len in 12"
                  :key="len"
                  :label="len"
                  :value="len"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="字段内容长度">
          <template slot-scope="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.contentLength'"
              :rules="{ required: true, message: '请选择字段内容长度', trigger: 'change' }"
            >
              <el-select v-model="scope.row.contentLength" placeholder="请选择">
                <el-option
                  v-for="len in 12"
                  :key="len"
                  :label="len"
                  :value="len"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.showType'"
              :rules="{ required: true, message: '请选择类型', trigger: 'change' }"
            >
              <el-select
                v-model="scope.row.showType"
                placeholder="请选择"
                @change="initOption(scope.row)"
              >
                <el-option label="文本框" :value="1" />
                <el-option label="下拉框" :value="2" />
                <el-option label="日期框" :value="3"/>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="字段名位置/行">
          <template slot-scope="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.row'"
              :rules="[
                { required: true, message: '请填写字段名所在行', trigger: 'blur' },
                { message: '请填写正确行数', trigger: 'blur', validator: checkPosition }
              ]"
            >
              <el-input v-model.number="scope.row.row" type="number" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="字段名位置/列">
          <template slot-scope="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.col'"
              :rules="[
                { required: true, message: '请填写字段名所在列', trigger: 'blur' },
                { message: '请填写正确列数', trigger: 'blur', validator: checkPosition }
              ]"
            >
              <el-input v-model.number="scope.row.col" type="number" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="openDialog(scope)">选项</el-button>
            <el-button
              v-if="!scope.row.isRequired"
              type="text"
              size="mini"
              @click="deleteRow(scope.$index)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <i
      class="el-icon-circle-plus-outline add-params"
      @click="addParams"
    />
    <el-dialog class="dialog" :visible.sync="pulldownTableVisible">
      <div class="dialog-head">
        <strong>字段名</strong>
        <el-button type="primary" size="mini" @click="savePulldownData">保存</el-button>
        <el-button type="primary" size="mini" @click="pulldownTableVisible = false">取消</el-button>
      </div>
      <el-form ref="pulldown" :model="pulldown">
        <el-table :data="pulldown.selection">
          <el-table-column label="预选字段" width="150">
            <template slot-scope="scope">
              <el-form-item
                :prop="'selection.' + scope.$index + '.text'"
                :rules="{ required: true, trigger: 'blur', validator: checkTextDouble }"
              >
                <el-input
                  v-model.trim="scope.row.text"
                  @click="doubleTextCheck(scope.$index, scope.row.text)"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="默认字段" width="100">
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
      </el-form>
      <i
        class="el-icon-circle-plus-outline add-params"
        @click="addPulldownData"
      />
    </el-dialog>
    <el-dialog :visible.sync="textTableVisible">
      <div class="dialog-head">
        <strong>字段名</strong>
        <el-button type="primary" size="mini" @click="saveTextData">保存</el-button>
        <el-button type="primary" size="mini" @click="textTableVisible = false">取消</el-button>
      </div>
      <el-input v-model.trim="textData" placeholder="请输入内容" class="dialog-text" />
    </el-dialog>
    <el-dialog :visible.sync="dateTableVisible">
      <div class="dialog-head">
        <strong>字段名</strong>
        <el-button type="primary" size="mini" @click="saveDateData">保存</el-button>
        <el-button type="primary" size="mini" @click="dateTableVisible = false">取消</el-button>
      </div>
      <el-date-picker
        v-model="dateData"
        type="datetime"
        format="yyyy年MM月dd日 HH:mm:ss"
        value-format="yyyy-MM-dd hh:mm:ss"
        placeholder="请选择日期时间"
        class="dialog-text">
      </el-date-picker>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    blockData: {
      type: Array,
      required: true
    },
    type: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      pulldownTableVisible: false,
      textTableVisible: false,
      dateTableVisible: false,
      // cell: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      paramTemp: {
        name: '',
        nameLength: null,
        contentLength: null,
        showType: null,
        row: null,
        col: null,
        option: null,
        type: this.type
      },
      pulldown: {
        rules: {
          text: { required: true, message: '请填写选项内容', trigger: 'blur' }
        },
        selection: [{ text: '', isDefault: false }]
      },
      textData: '',
      dateData: '',
      model: {
        tableData: this.blockData
      },
      editingBlockIndex: null
    }
  },
  methods: {
    checkPosition(rule, value, callback) {
      if (value < 1) {
        return callback(new Error('请填写正确位置'))
      }
      callback()
    },
    checkDouble(rule, value, callback) {
      const index = rule.field.split('.')[1]
      if (!value) {
        callback(new Error('字段名不能为空'))
      } else if (this.doubleNameCheck(+index, value)) {
        callback(new Error('字段名不能重复'))
      } else {
        callback()
      }
    },
    doubleNameCheck(index, value) {
      return this.model.tableData.some(({ name }, i) => {
        return i === index ? false : name === value
      })
    },
    checkTextDouble(rule, value, callback) {
      const index = rule.field.split('.')[1]
      if (!value) {
        callback(new Error('选项内容不能为空'))
      } else if (this.doubleTextCheck(+index, value)) {
        callback(new Error('选项内容不能重复'))
      } else {
        callback()
      }
    },
    doubleTextCheck(index, value) {
      return this.pulldown.selection.some(({ text }, i) => {
        return i === index ? false : text === value
      })
    },
    initOption(item) {
      if (item.showType === 1 || item.showType === 3) {
        item.option = ''
      } else {
        item.option = []
      }
    },
    addParams() {
      this.blockData.push({ ...this.paramTemp })
    },
    deleteRow(index) {
      this.$confirm('确定删除此字段吗?', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.blockData.splice(index, 1)
      }).catch(() => {})
    },
    openDialog(item) {
      const { row: { showType, option }, $index } = item
      if (!showType) {
        this.$message({
          message: '请选择字段类型',
          type: 'warning'
        })
        return
      }
      if (showType === 1) {
        this.textData = option || ''
        this.textTableVisible = true
      } else if (showType === 2) {
        this.pulldown.selection = option || [{ text: '', isDefault: false }]
        // item.option = this.pulldownData
        this.pulldownTableVisible = true
      } else {
        this.dateData = option || ''
        this.dateTableVisible = true
      }
      this.editingBlockIndex = $index
    },
    addPulldownData() {
      this.pulldown.selection.push({
        text: '',
        isDefault: false
      })
    },
    deletePulldownData(data) {
      this.pulldown.selection.splice(data.$index, 1)
    },
    savePulldownData() {
      this.$refs.pulldown.validate((valid) => {
        if (valid) {
          this.blockData[this.editingBlockIndex].option = this.pulldown.selection
          this.$message.success('保存成功')
          this.pulldownTableVisible = false
        } else {
          return false
        }
      })
    },
    saveTextData() {
      this.blockData[this.editingBlockIndex].option = this.textData
      this.$message.success('保存成功')
      this.textTableVisible = false
    },
    saveDateData() {
      this.blockData[this.editingBlockIndex].option = this.dateData
      this.$message.success('保存成功')
      this.dateTableVisible = false
    },
    saveBlockData() {
      let res
      this.$refs.form.validate((valid) => {
        if (valid) {
          res = this.blockData.every((item) => {
            if (item.showType !== 2) return true
            if (!item.option || !item.option.length) {
              this.$message.error(`请点击选项按钮完善${item.name}字段下拉框数据`)
              return false
            }
            return true
          })
        } else {
          res = false
        }
      })
      return res
    }
  }
}
</script>

<style lang="scss" scoped>
.add-params {
  margin-left: 10px;
  margin-top: 10px;
  font-size: 30px;
  color: #606266;
  cursor: pointer;
}
/deep/ .el-table {
  td:last-child {
    padding-top: 18px;
    vertical-align: top;
  }
}
.block-custom {
  display: inline-block;
  height: 46px;
}
.dialog {
  &-head {
    padding-left: 10px;
    strong {
      margin-right: 20px;
      display: inline-block;
      font-size: 18px;
      line-height: 28px;
    }
  }
  /deep/ .el-table {
    td:nth-child(2) {
      padding-top: 20px;
      vertical-align: top;
    }
    td:last-child {
      padding-top: 11px;
      vertical-align: top;
    }
  }
  &-text {
    margin-top: 20px;
    margin-left: 10px;
    width: 200px;
  }
}
</style>
