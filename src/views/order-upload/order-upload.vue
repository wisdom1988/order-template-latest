<template>
  <div class="uploader-wrap">
    <uploader
      ref="uploader"
      :options="options"
      class="uploader-example"
      @file-progress="setProgress"
    >
      <uploader-unsupport />
      <uploader-drop>
        <i class="el-icon-cloudy" />
      </uploader-drop>
      <uploader-list />
      <uploader-btn>上传</uploader-btn>
      <button class="uploader-cancel" @click="cancelUpload">取消</button>
    </uploader>
    <div class="uploader-progress">
      <el-progress
        type="circle"
        :percentage="uploaderProgress"
        :width="30"
        :stroke-width="3"
        :show-text="false"
        class="uploader-progress-circle"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: {
        target:
          'https://github.com/simple-uploader/Uploader/tree/develop/samples/Node.js'
      },
      uploaderProgress: 0,
      uploader: null
    }
  },

  mounted() {
    this.uploader = this.$refs.uploader.uploader
  },

  methods: {
    setProgress(rootFile, file, chunk) {
      console.log(rootFile, file, chunk)
      this.uploaderProgress = this.uploader.progress() * 100
    },
    cancelUpload() {
      this.uploader.cancel()
    }
  }
}
</script>

<style lang="less">
.uploader {
  &-wrap {
    position: relative;
  }
  &-drop {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 330px;
    height: 180px;
    background: #f6f7f9;
    border: 1px solid rgba(110, 118, 143, 0.2);
  }
  &-progress {
    position: absolute;
    top: 0;
    left: 0;
    width: 330px;
    height: 180px;
    z-index: 99;
    background: rgba(0, 0, 0, 0.7);
    &-circle {
      position: absolute;
      top: 62px;
      left: 150px;
    }
  }
  &-file-progress {
    background: #fff !important;
  }
  &-btn,
  &-cancel {
    margin-top: 28px;
    width: 155px;
    border-radius: 17px;
    font-size: 13px;
    text-align: center;
    line-height: 30px;
  }
  &-btn {
    background: #3a78ea;
  }
  &-cancel {
    margin-left: 20px;
    border: 1px solid #3a78ea;
    background: #fff;
    color: #3a78ea;
  }
  &-list {
    width: 330px;
  }
}
</style>
