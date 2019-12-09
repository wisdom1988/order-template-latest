<template>
  <div class="login">
    <div class="login-bg" />
    <div class="login-container">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

        <div class="title-container">
          <img src="./logo.png" alt="logo">
          <h3 class="title">自动化系统</h3>
        </div>

        <div class="form-container">
          <!-- <h5 v-show="status === 1">登陆</h5>
          <h5 v-show="status === 2">找回密码</h5> -->
          <el-form-item v-show="status === 1 || status === 2" prop="name">
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

          <el-form-item v-show="status === 2" prop="email">
            <!-- <span class="svg-container">
              <svg-icon icon-class="user" />
            </span> -->
            <el-input
              ref="usermail"
              v-model="loginForm.email"
              placeholder="注册邮箱"
              name="usermail"
              type="text"
              tabindex="1"
            />
          </el-form-item>

          <div v-if="status === 3" class="mail-wrap">
            <img src="./email.png">
            <div class="mail">邮件发送成功</div>
          </div>

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
      <code-verify v-if="showCodeVerify" @confirm="verifyLogin" />
    </div>
  </div>
</template>

<script>
// import { validUsername, validMail } from '@/utils/validate'
import { validMail } from '@/utils/validate'
import { getLocal, setLocal, removeLocal } from '@/utils'
import { resetPassword } from '@/api/user'
import CodeVerify from './code-verify'

export default {
  name: 'Login',
  components: {
    CodeVerify
  },
  data() {
    return {
      status: 1, // 1: 登陆 2: 找回密码 3: 发送邮件成功
      loginForm: {
        name: '',
        password: '',
        email: ''
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
    validatePassword(rule, value, callback) {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位数'))
      } else {
        callback()
      }
    },
    validateMail(rule, value, callback) {
      if (!validMail(value)) {
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
      if (this.status === 2) {
        return this.resetPassword()
      }
      this.status = 1
    },
    checkCode() {
      const errTimes = getLocal('loginErr')
      if (errTimes < 3 || !errTimes) return true
      // 已经输错三次以上且没有输入验证码
      this.showCodeVerify = true
      return false
    },
    resetPassword() {
      this.$refs.loginForm.validate(valid => {
        if (!valid) return
        const { password, ...reqData } = this.loginForm
        console.log(password)
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        resetPassword(reqData).then(() => {
          loading.close()
          this.status = 3
        }).catch(() => {
          loading.close()
        })
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          if (!this.checkCode()) return
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.loading = false
            removeLocal('loginErr')
            this.$router.push({ path: this.redirect || '/order' })
          }).catch((err) => {
            this.loading = false
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
      const reqParams = Object.assign(this.loginForm, {
        code
      })
      this.loading = true
      this.$store.dispatch('user/login', reqParams).then(() => {
        this.loading = false
        removeLocal('loginErr')
        this.$router.push({ path: this.redirect || '/order' })
      }).catch((err) => {
        this.loading = false
        if (err.code !== 1001) return
        let errTimes = getLocal('loginErr')
        if (errTimes) {
          setLocal('loginErr', ++errTimes)
        } else {
          setLocal('loginErr', 1)
        }
      })
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
  // background: rgb(242, 242, 242) url('./bg.jpg') center bottom no-repeat;
  // background-size: contain;
  // background-attachment: scroll;
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

  .mail-wrap {
    margin-bottom: 35px;
    padding-top: 37px;
    font-size: 16px;
    color: #20C170;
    line-height: 36px;
    font-weight: 600;
    text-align: center;
    img {
      margin-bottom: 6px;
      vertical-align: middle;
    }
  }
}
</style>

<style lang="scss" scoped>
$bg:rgb(242, 242, 242);
$dark_gray:#889aa4;
// $light_gray:#3a78ea;
$light_gray:#2d8acd;

.el-button--primary {
  background: #3A78EA;
}

.login {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.login-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgb(242, 242, 242) url('./bg.jpg') center bottom no-repeat;
  background-size: 100% auto;
  background-attachment: scroll;
}

.login-container {
  min-height: 550px;
  // min-width: 1088px;
  min-width: 900px;
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
      color: #2d8acd;
      margin: 0px auto 24px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .form-container {
    width: 390px;
    padding: 10px 30px 60px;
    border-radius: 5px;
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
      font-weight: 600;
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
