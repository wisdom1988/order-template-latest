<template>
  <div class="list-wrap">
    <el-button class="list-add" type="primary" @click="$emit('edit', 2)">新建模板</el-button>
    <div class="list">
      <div
        v-for="item in templateList"
        :key="item.tempId"
        class="list-content"
      >
        <div class="list-content-name" @click="$emit('edit', 3, item)">{{ item.title }}</div>
        <div
          class="list-content-icon"
          @click="setItem(item)"
        >
          <!-- <img v-if="item.icon" :src="item.icon">
          <i v-else class="el-icon-plus" />
          <input type="file" title="" @change="updateTemplateIcon($event.target.files, item)"> -->
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :before-upload="uploadCheck"
            :http-request="uploadRequest"
          >
            <img v-if="item.icon" :src="item.icon" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </div>
      </div>
    </div>
    <div class="list-pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="page"
        @current-change="changePage"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TemplateList',
  props: {
    total: {
      type: Number,
      required: true
    },
    page: {
      type: Number,
      required: true
    },
    templateList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      file: null,
      localFilePreview: null,
      uploadingItem: null
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    // updateTemplateIcon(file, item) {
    //   console.log(file, item)
    // },
    setItem(item) {
      this.uploadingItem = item
    },
    uploadCheck(file) {
      const fileSize = 5
      const allowType = /.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/
      const size = (file.size / 1024 / 1024 > fileSize)
      if (!allowType.test(file.name)) {
        this.$message.error('请上传图片文件')
        return false
      }

      if (size) {
        this.$message.error(`图片大小不超过 ${fileSize}M`)
        return false
      }
      this.file = file
      // 临时添加
      this.localFilePreview = URL.createObjectURL(file)
      return true
    },
    uploadRequest() {
      setTimeout(() => {
        // 临时添加，返回后要再调用上传对应模板的接口，成功后再赋值
        this.uploadingItem.icon = this.localFilePreview
      }, 0)
    },
    changePage(page) {
      this.$emit('page', page)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.el-icon-plus:before {
  font-size: 40px;
}

.list {
  @include clearfix;
  &-add {
    margin-bottom: 20px
  }

  &-content {
    float: left;
    margin-right: 30px;
    margin-bottom: 20px;
    width: 120px;
    height: 150px;
    text-align: center;
    border-radius: 4px;
    border: 1px solid #409EFF;
    overflow: hidden;
    &-name {
      color: #fff;
      line-height: 24px;
      background: #409EFF;
      cursor: pointer;
    }

    &-icon {
      position: relative;
      height: 126px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      img {
        vertical-align: middle;
        max-width: 100%;
      }
      input {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
    }
  }

  &-pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
