<template>
  <div class="user">
    <el-button type="primary" class="user-new" @click="updateStatus(2)">新建用户</el-button>
    <el-table
      :data="userList"
      border
      style="width: 100%"
    >
      <el-table-column
        label="用户名"
      >
        <template slot-scope="scope">
          <div class="user-edit" @click="editUser(scope.row)">
            {{ scope.row.name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="id"
        label="用户id"
      />
      <el-table-column
        label="用户权限"
        width="120px"
      >
        <template slot-scope="scope">
          <div>
            {{ scope.row.type | formatRole }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="allowCapacity"
        label="存储空间(GB)"
        width="120px"
      />
      <el-table-column
        prop="email"
        label="邮箱"
        min-width="200px"
      />
      <el-table-column
        label="可用"
        width="80px"
      >
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isEnabled" disabled />
        </template>
      </el-table-column>
    </el-table>
    <div class="user-pagination">
      <el-pagination
        background
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="total"
        @current-change="changePage"
      />
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { getUserList } from '@/api/manage'

export default {
  name: 'UserList',

  data() {
    return {
      userList: [],
      total: null,
      currentPage: 1,
      pageSize: 20
    }
  },

  filters: {
    formatRole(type) {
      if (!type) return '普通用户'
      if (type === 1) return '管理员'
      if (type === 2) return '子账户'
    }
  },

  created() {
    this.getList()
  },

  activated() {
    this.getList()
  },

  methods: {
    ...mapMutations({
      updateStatus: 'admin/UPDATE_STATUS',
      updateUserInfo: 'admin/UPDATE_USERINFO'
    }),
    getList() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const { currentPage: page, pageSize } = this
      getUserList({
        page,
        pageSize
      }).then((data) => {
        data.list.forEach((item) => {
          item.isEnabled = Boolean(item.isEnabled)
        })
        this.total = data.total
        this.userList = data.list
        loading.close()
      }, () => {
        this.userList = []
        loading.close()
      })
    },
    changePage(val) {
      this.currentPage = val
      this.getList()
    },
    editUser(data) {
      this.updateUserInfo(data)
      this.updateStatus(3)
    }
  }
}
</script>

<style lang='scss' scoped>
/deep/ .el-table {
  th, td {
    padding: 6px 0;
  }
}

.user {
	&-new {
		margin-bottom: 15px;
	}
	&-edit {
		color: #409eff;
		cursor: pointer;
	}
	&-pagination {
		margin-top: 10px;
    float: right;
	}
}
</style>
