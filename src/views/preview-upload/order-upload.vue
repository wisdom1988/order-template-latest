<template>
  <div class="upload-wrap">
    <div class="upload-title">上传文件</div>
    <div class="upload">
      <uploader
        ref="uploader"
        :options="options"
        @upload-start="showProgress = true"
        @complete="showProgress = false"
        @file-progress="setProgress"
        @file-removed="handleRemove"
        @file-success="handleSuccess"
      >
        <uploader-unsupport />
        <uploader-drop>
          <img src="./icon_upload.png">
        </uploader-drop>
        <uploader-list />
        <div class="uploader-handle">
          <uploader-btn class="uploader-up">上传</uploader-btn>
          <button class="uploader-cancel" @click="cancelUpload">取消</button>
        </div>
        <div class="uploader-start">
          <button @click="startOrder">启动</button>
        </div>
      </uploader>
      <div v-if="showProgress" class="upload-progress">
        <el-progress
          type="circle"
          :percentage="uploaderProgress"
          :width="30"
          :stroke-width="3"
          :show-text="false"
          class="upload-progress-circle"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mergeFile, deleteFile, startOrder } from '@/api/manage'
import { getUserId } from '@/utils/auth'

const file_api_root = process.env.VUE_APP_FILE_ROOT

export default {
  data() {
    return {
      file_api_root,
      showProgress: false,
      uploaderProgress: 0,
      uploader: null
    }
  },

  computed: {
    ...mapState({
      savePath: ({ template }) => template.savePath,
      taskId: ({ template }) => template.taskId,
      jobId: ({ template }) => template.jobId,
      jobName: ({ template }) => template.jobName
    }),
    options() {
      return {
        target:
        `${this.file_api_root}/v1/upload`,
        method: 'multipart',
        testMethod: 'post',
        testChunks: false,
        query: {
          savePath: this.savePath
        }
      }
    }
  },

  mounted() {
    this.uploader = this.$refs.uploader.uploader
  },

  methods: {
    setProgress(rootFile, file, chunk) {
      this.uploaderProgress = this.uploader.progress() * 100
    },
    cancelUpload() {
      this.$confirm('', '确定要删除/取消上传的文件吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      }).then(() => {
        this.uploader.cancel()
        this.showProgress = false
        deleteFile({ savePath: this.savePath })
      }).catch(() => {})
    },
    handleRemove(file) {
      console.log(file)
    },
    handleSuccess(rootFile, file, message, chunk) {
      const { uniqueIdentifier: identifier, name } = file
      const suffix = `.${name.split('.').slice(-1)[0]}`
      mergeFile({
        identifier,
        suffix,
        savePath: this.savePath
      })
    },
    startOrder() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const params = {
        userId: +getUserId(),
        id: this.jobId,
        jobName: this.jobName
      }
      startOrder(params).then(() => {
        this.$message.success('工单启动成功')
        loading.close()
        setTimeout(() => {
          this.$router.push('/order/list')
        }, 1000)
      }, () => {
        loading.close()
      })
    }
  }
}
</script>

<style lang="scss">
.upload {
  position: relative;
  &-wrap {
    position: relative;
    padding: 32px 20px;
  }
  &-title {
    margin-bottom: 25px;
    font-size: 14px;
    color: #666;
    font-weight: 600;
  }
  .uploader {
    &-drop {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 330px;
      height: 180px;
      background: #f6f7f9;
      border: 1px dashed rgba(110, 118, 143, 0.2);
    }
    &-handle {
      margin-top: 28px;
      display: flex;
      justify-content: space-between;
    }
    &-start {
      margin-top: 30px;
      text-align: center;
      button {
        width: 200px;
        line-height: 30px;
        border: none;
        border-radius: 15px;
        cursor: pointer;
        background: #ccc;
      }
    }
    &-up {
      margin-right: 20px;
      padding: 0;
      width: 155px;
      font-size: 13px;
      font-weight: 400;
      line-height: 30px;
      height: 32px;
      color: #fff;
      text-align: center;
      background: #3A78EA;
      border-radius: 16px;
      border: 1px solid #3A78EA;
      &:hover {
        background: #3A78EA;
      }
    }
    &-cancel {
      flex: 1;
      font-size: 13px;
      color: #3A78EA;
      line-height: 30px;
      background: #fff;
      text-align: center;
      border: 1px solid #3A78EA;
      border-radius: 16px;
      cursor: pointer;
      outline: none;
    }
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
  // &-btn,
  // &-cancel {
  //   margin-top: 28px;
  //   width: 155px;
  //   border-radius: 17px;
  //   font-size: 13px;
  //   text-align: center;
  //   line-height: 30px;
  // }
  // &-btn {
  //   background: #3a78ea;
  // }
  // &-cancel {
  //   margin-left: 20px;
  //   border: 1px solid #3a78ea;
  //   background: #fff;
  //   color: #3a78ea;
  // }
  &-list {
    width: 330px;
  }
}
</style>
