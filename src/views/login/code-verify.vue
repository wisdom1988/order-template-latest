<template>
  <modal :visible="true">
    <div class="box">
      <div class="box-title">请输入图形验证码</div>
      <div class="box-content">
        <el-input v-model.trim="verifyCode" class="box-content-code" inline />
        <img v-if="codeStatus" src="http://47.102.149.201/cap.php?v=0" alt="验证码" @click="codeStatus = false">
        <img v-else src="http://47.102.149.201/cap.php?v=1" alt="验证" @click="codeStatus = true">
      </div>
      <div class="box-confirm" @click="confirm">确认</div>
    </div>
  </modal>
</template>

<script>
import Modal from '@/components/modal'
// import { getVerify } from '@/api/user'

export default {
  components: {
    Modal
  },
  data() {
    return {
      verifyCode: '',
      codeStatus: false,
      verifyImg: ''
    }
  },
  created() {
    // this.getVerify()
  },

  methods: {
    // getVerify() {
    //   getVerify().then(data => {
    //     this.verifyImg = data
    //   })
    // },
    confirm() {
      if (!this.verifyCode) {
        return this.$message.error('请输入验证码')
      }
      this.$emit('confirm', this.verifyCode)
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  background: #fff;
  width: 280px;
  height: 192px;
  border-radius: 4px;
  padding: 32px;

  &-title {
    color: #000;
    font-size: 16px;
  }

  &-content {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-code {
      width: 125px !important;
      height: 36px !important;
    }
    /deep/ .el-input__inner {
      height: 36px;
      line-height: 36px;
      border: 1px solid #E3E3E3;
    }
    img {
      width: 82px;
      height: 36px;
      cursor: pointer;
    }
  }
  &-confirm {
    margin-top: 14px;
    line-height: 36px;
    border-radius: 2px;
    color: #fff;
    font-size: 14px;
    background: #3A78EA;
  }
}
</style>
