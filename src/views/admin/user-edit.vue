<template>
  <div class="edit">
    <h2 class="edit-type"> {{ pageType }}</h2>
		<el-form :inline="true" :model="formData" class="edit-form">
			<el-form-item label="用户名:" required>
				<el-input v-model="formData.name" placeholder="请填写用户名"></el-input>
			</el-form-item>
			<el-form-item v-if="formData.userId" label="用户ID:">
				<el-input v-model="formData.userId" placeholder="用户ID" disabled></el-input>
			</el-form-item>
			<el-form-item label="邮箱:" required>
				<el-input v-model="formData.email" placeholder="请填写邮箱"></el-input>
			</el-form-item>
			<el-form-item label="用户权限:" required>
				<el-select v-model="formData.type" placeholder="请选择用户权限">
					<el-option label="管理员" :value="1"></el-option>
					<el-option label="普通用户" :value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="存储空间(G):">
				<el-input v-model="formData.allowCapacity" placeholder="请填写存储空间"></el-input>
			</el-form-item>
			<el-form-item label="可用:">
				<el-checkbox v-model="formData.isEnabled"></el-checkbox>
			</el-form-item>
			<el-form-item label="更改密码:">
				<el-input v-model="formData.password" placeholder="请填写密码"></el-input>
			</el-form-item>
			<el-form-item class="edit-btn">
				<el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
				<el-button @click="updateStatus(1)">取消</el-button>
				<el-button v-if="status === 2" type="danger">删除</el-button>
			</el-form-item>
		</el-form>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { deepCopy } from '@/utils'

export default {
	name: 'UserEdit',

	data() {
		return {
			formData: {}
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
	},

	watch: {
		userInfo: {
			handler(val) {
				this.formData = this.status === 3 ? deepCopy(val) : {
					userId: '',
					name: '',
					email: '',
					allowCapacity: '',
					password: '',
					isEnabled: '',
					type: ''
				}
			},
			immediate: true
		}
	},
	
	methods: {
		...mapMutations({
			updateStatus: 'admin/UPDATE_STATUS'
		}),

		submitForm() {
			console.log('baocun')
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

	&-btn {
		display: block;
	}
}
</style>
