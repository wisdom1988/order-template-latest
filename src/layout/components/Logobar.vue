<template>
  <div class="logobar">
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img src="./avatar.gif?imageView2/1/w/80/h/80" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <div @click="jumpDetail">
            <el-dropdown-item class="user">
              <span>{{ name }}</span>
            </el-dropdown-item>
          </div>
          <router-link to="/order/list">
            <el-dropdown-item>
              工单列表
            </el-dropdown-item>
          </router-link>
          <router-link v-if="userType === 1" to="/admin">
            <el-dropdown-item>
              控制面板
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出系统</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { removeToken, removeUserId } from '@/utils/auth'

export default {
  computed: {
    ...mapGetters([
      'name', 'userType', 'userInfo'
    ])
  },
  methods: {
    ...mapMutations({
      setUserName: 'user/SET_NAME',
      updateStatus: 'admin/UPDATE_STATUS',
      updateUserInfo: 'admin/UPDATE_USERINFO'
    }),
    logout() {
      removeToken()
      removeUserId()
      this.setUserName('')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    jumpDetail() {
      this.updateStatus(4)
      this.updateUserInfo(this.userInfo)
      this.$router.push('/user/info')
    }
  }
}
</script>

<style lang="scss">
.user.el-dropdown-menu__item.is-disabled {
  color: #606266;
}
</style>

<style lang="scss" scoped>
.logobar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #2e4156 url('./logo.png') 24px center no-repeat;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
