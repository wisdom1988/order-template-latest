<template>
  <div class="edit">
    <h2 class="edit-type"> {{ pageType }}</h2>
    <el-form ref="form" :inline="true" :model="formData" :rules="rules" class="edit-form">
      <el-form-item label="用户名:" prop="name">
        <el-input v-model.trim="formData.name" placeholder="请填写用户名" />
      </el-form-item>
      <el-form-item v-if="formData.id" label="用户ID:">
        <el-input v-model="formData.id" placeholder="用户ID" disabled />
      </el-form-item>
      <el-form-item label="邮箱:" prop="email">
        <el-input v-model="formData.email" placeholder="请填写邮箱" />
      </el-form-item>
      <el-form-item label="用户权限:" required prop="type">
        <el-select v-model="formData.type" placeholder="请选择用户权限">
          <el-option label="管理员" :value="1" />
          <el-option label="普通用户" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="存储空间(G):">
        <el-input v-model="formData.allowCapacity" placeholder="请填写存储空间" />
      </el-form-item>
      <el-form-item label="可用:">
        <el-checkbox v-model="formData.isEnabled" />
      </el-form-item>
      <el-form-item label="更改密码:">
        <el-input v-model="formData.password" placeholder="请填写密码" />
      </el-form-item>
      <el-form-item label="可用模板" class="edit-template" prop="template">
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="toggleAll">全选</el-checkbox>
        <div style="margin: 0;" />
        <el-checkbox-group v-model="formData.template" @change="checkTemplate">
          <el-checkbox v-for="template in templateList" :key="template.tempId" :label="template.tempId">{{ template.title }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item class="edit-btn">
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button @click="updateStatus(1)">取消</el-button>
        <el-button v-if="status === 3" type="danger" @click="deleteUser">删除</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { getTemplateList, addUser, editUser, deleteUser } from '@/api/manage'
import { deepCopy } from '@/utils'
import { validMail } from '@/utils/validate'
import { getUserId } from '@/utils/auth'

export default {
  name: 'UserEdit',

  data() {
    const validateMail = (rule, value, callback) => {
      if (validMail(value)) return callback()
      callback(new Error('请输入正确的邮箱'))
    }
    const validateTemplate = (rule, value, callback) => {
      if (value.length) return callback()
      callback(new Error('请至少选择一个模板'))
    }
    return {
      formData: {},
      rules: {
        name: { required: true, message: '请输入用户名', trigger: 'blur' },
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateMail, trigger: 'blur' }
        ],
        type: { required: true, message: '请选择用户权限', trigger: ['change', 'blur'] },
        template: { validator: validateTemplate, trigger: 'blur' }
      },
      templateList: [],
      checkAll: false,
      isIndeterminate: true
    }
  },

  computed: {
    ...mapState({
      status: ({ admin }) => admin.status,
      userInfo: ({ admin }) => admin.userInfo
    }),
    pageType() {
      return this.status === 2 ? '新建用户' : '编辑用户'
    },
    templateIds() {
      return this.templateList.map((item) => {
        return item.tempId
      })
    }
  },

  watch: {
    userInfo: {
      handler(val) {
        this.formData = this.status === 3 ? deepCopy(val) : {
          name: '',
          email: '',
          allowCapacity: '',
          password: '',
          isEnabled: 1,
          type: '',
          template: []
        }
        this.formData.isEnabled = !!this.formData.isEnabled
        this.formData.password = ''
      },
      immediate: true
    },
    templateIds(val) {
      if (!this.formData.template.length) {
        this.formData.template = deepCopy(val)
        this.checkAll = true
        return
      }
      // eslint-disable-next-line
      this.checkAll = this.formData.template.length === val.length ? true : false
    }
  },

  created() {
    this.getTemplateList()
  },

  methods: {
    ...mapMutations({
      updateStatus: 'admin/UPDATE_STATUS'
    }),

    getTemplateList() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      getTemplateList({ page: 1, number: 100 }).then((data) => {
        this.templateList = data.list
        loading.close()
      }).catch(() => {
        loading.close()
      })
    },

    toggleAll(val) {
      this.formData.template = val ? deepCopy(this.templateIds) : []
      this.isIndeterminate = false
    },

    checkTemplate(val) {
      const checkedCount = val.length
      this.checkAll = checkedCount === this.templateList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.templateList.length
    },

    submitForm() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        const { isEnabled, ...rest } = this.formData
        const reqMethod = this.status === 2 ? addUser : editUser
        const successMessage = this.status === 2 ? '创建成功' : '编辑成功'
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        reqMethod({
          ...rest,
          isEnabled: +isEnabled
        }).then(() => {
          this.$message.success(successMessage)
          this.updateStatus(1)
          loading.close()
        }).catch(() => {
          loading.close()
        })
      })
    },

    deleteUser() {
      this.$confirm('', '确定要删除该用户吗？', {
        confirmButtonText: '确定',
        cancelButtonClass: '取消',
        center: true
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        deleteUser({
          id: this.formData.id,
          userId: getUserId()
        }).then(() => {
          this.$message.success('删除成功')
          this.updateStatus(1)
          loading.close()
        }).catch(() => {
          loading.close()
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form--inline {
	.el-form-item {
		margin-right: 20px;
	}
}
h2 {
	margin: 0;
	padding: 0;
}
.edit {
  &-form {
		margin-top: 20px;
	}

	&-btn, &-template {
		display: block;
	}
}
</style>
