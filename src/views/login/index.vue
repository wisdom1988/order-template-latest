<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <img src="./logo.png" alt="logo">
        <h3 class="title">自动化系统</h3>
      </div>

      <div class="form-container">
        <h5 v-show="status === 1">登陆</h5>
        <h5 v-show="status === 2">找回密码</h5>
        <el-form-item prop="name">
          <!-- <span class="svg-container">
            <svg-icon icon-class="user" />
          </span> -->
          <el-input
            ref="username"
            v-model="loginForm.name"
            placeholder="用户名称"
            name="name"
            type="text"
            tabindex="1"
          />
        </el-form-item>

        <el-form-item v-show="status === 1" prop="password">
          <!-- <span class="svg-container">
            <svg-icon icon-class="password" />
          </span> -->
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <el-form-item v-show="status === 2" prop="usermail">
          <!-- <span class="svg-container">
            <svg-icon icon-class="user" />
          </span> -->
          <el-input
            ref="usermail"
            v-model="loginForm.usermail"
            placeholder="用户名称"
            name="usermail"
            type="text"
            tabindex="1"
          />
        </el-form-item>

        <el-button :loading="loading" type="primary" style="width:100%; margin-bottom:30px;" @click.native.prevent="handleBtn">
          {{ btnText }}
        </el-button>

        <div v-if="status === 1 || status === 2" class="toggleStatus" @click="toggleStatus">
          {{ status === 1 ? '忘记密码' : '返回登陆' }}
        </div>

        <!-- <div class="tips">
          <span style="margin-right:20px;">username: admin</span>
          <span> password: any</span>
        </div> -->
      </div>
    </el-form>
    <code-verify :visible="showCodeVerify" @click="verifyLogin" />
  </div>
</template>

<script>
// import { validUsername, validMail } from '@/utils/validate'
import CodeVerify from './code-verify'
import { validMail } from '@/utils/validate'
import { getLocal, setLocal, removeLocal } from '@/utils'

export default {
  name: 'Login',
  components: {
    CodeVerify
  },
  data() {
    return {
      status: 1, // 1: 登陆 2: 找回密码 3: 发送邮件成功
      loginForm: {
        name: 'admin',
        password: '653431',
        usermail: ''
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      showCodeVerify: false,
      verifyCode: ''
    }
  },
  computed: {
    btnText() {
      if (this.status === 1) {
        return '登陆'
      }
      if (this.status === 2) {
        return '发送邮件'
      }
      return '确定'
    },
    loginRules() {
      return {
        name: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        password: [{ required: this.status === 1, trigger: 'blur', validator: this.validatePassword }],
        usermail: [{ required: this.status === 2, trigger: 'blur', validator: this.validateMail }]
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    // validateUsername(rule, value, callback) {
    //   if (!validUsername(value)) {
    //     callback(new Error('请输入正确的用户名'))
    //   } else {
    //     callback()
    //   }
    // },
    validatePassword(rule, value, callback) {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    },
    validateMail(rule, value, callback) {
      if (!validMail) {
        callback(new Error('请输入正确的邮箱'))
      } else {
        callback()
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    toggleStatus() {
      this.status = this.status === 1 ? 2 : 1
    },
    handleBtn() {
      if (this.status === 1) {
        return this.handleLogin()
      }
    },
    checkCode() {
      const errTimes = getLocal('loginErr')
      if (errTimes < 3) {
        return {}
      }
      // 已经输错三次以上且没有输入验证码
      if (!this.verifyCode) {
        this.showCodeVerify = true
        // 获取验证码图片
        return false
      }
      return {
        code: this.verifyCode
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          const extraParams = this.checkCode()
          if (!extraParams) return
          this.loading = true
          this.$store.dispatch('user/login', Object.assign(this.loginForm, extraParams)).then(() => {
            this.$router.push({ path: this.redirect || '/order' })
            this.loading = false
            this.verifyCode = ''
            removeLocal('loginErr')
          }).catch((err) => {
            this.loading = false
            this.verifyCode = ''
            if (err.code !== 1001) return
            let errTimes = getLocal('loginErr')
            if (errTimes) {
              setLocal('loginErr', ++errTimes)
            } else {
              setLocal('loginErr', 1)
            }
          })
        } else {
          return false
        }
      })
    },
    verifyLogin(code) {
      this.verifyCode = code
      this.showCodeVerify = false
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
// $cursor: #fff;

// @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
//   .login-container .el-input input {
//     color: $cursor;
//   }
// }

/* reset element-ui css */
.login-container {
  height: 100vh;
  background: #000 url('./bg.png') center center no-repeat;
  background-size: contain;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      // color: $light_gray;
      height: 47px;
      // caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        // -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid #e5e5e5;
    background: #fff;
    border-radius: 2px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#000;
$dark_gray:#889aa4;
$light_gray:#3a78ea;

.el-button--primary {
  background: #3A78EA;
}

.login-container {
  min-height: 100vh;
  min-width: 1088px;
  background-color: $bg;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .login-form {
    position: relative;
    width: 390px;
    // margin: 0 auto;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    text-align: center;
    img {
      margin-bottom: 18px;
      width: 168px;
      vertical-align: middle;
    }

    .title {
      font-size: 28px;
      line-height: 34px;
      color: #fff;
      margin: 0px auto 24px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .form-container {
    width: 390px;
    padding: 38px 30px 60px;
    box-shadow: 4px 4px 20px 0 rgba(0, 0, 0, .1);
    border-radius: 5px;
    background: #fff;
    h5 {
      padding: 0;
      margin: 0;
      margin-bottom: 35px;
      font-size: 24px;
      color: #737373;
    }
    .el-form-item {
      margin-bottom: 26px;
    }
    .el-input {
      input {
        color: #ddd;
      }
    }
    .el-button {
      margin-bottom: 15px!important;
      padding: 15px 0;
      font-size: 18px;
      border-radius: 2px;
    }
    .toggleStatus {
      color: $light_gray;
      font-size: 14px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
