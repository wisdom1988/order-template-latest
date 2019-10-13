<template>
  <div class="list-wrap">
    <el-button class="list-add" type="primary" @click="$emit('edit', 2)">新建模板</el-button>
    <div class="list">
      <div
        v-for="item in templateList"
        :key="item.tempId"
        class="list-content">
        <div class="list-content-name" @click="$emit('edit', 3, item)">{{ item.title }}</div>
        <div class="list-content-icon">
          <img v-if="item.icon" :src="item.icon">
          <i v-else class="el-icon-plus"></i>
          <input type="file" @change="updateTemplateIcon($event.target.files, item)" title="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  props: {
    templateList: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    updateTemplateIcon(file, item) {
      console.log(file, item)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-icon-plus:before {
  font-size: 40px;
}

.list {
  &-add {
    margin-bottom: 20px
  }

  &-content {
    float: left;
    margin-right: 30px;
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
}
</style>
