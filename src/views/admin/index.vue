<template>
  <div class="app-container">
    <transition name="fade" mode="out-in">
      <keep-alive include="UserList">
        <component :is="view"></component>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import UserList from './user-list'
import UserEdit from './user-edit'

export default {
  components: {
    UserList,
    UserEdit
  },

  data() {
    return {}
  },

  computed: {
    ...mapState({
      status: ({ admin }) => admin.status
    }),
    view() {
      return this.status === 1 ? 'UserList' : 'UserEdit'
    }
  },

  created() {
    this.updateStatus(1)
  },

  methods: {
    ...mapMutations({
      updateStatus: 'admin/UPDATE_STATUS'
    }),
  }
}
</script>
<style lang='scss' scoped>
/deep/ .el-table {
  th, td {
    padding: 6px 0;
  }
}

.new-user {
  margin-bottom: 15px;
}

.pagination {
  margin-top: 10px;
  float: right;
}
</style>
