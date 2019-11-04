<template>
  <div ref="wrapper" class="template-wrap" @scroll="handlerScroll">
    <div ref="template" class="template">
      <div class="template-title">选择工单模板</div>
      <div class="template-items">
        <div
          v-for="item in templateList"
          :key="item.tempId"
          class="template-item"
          @click="chooseTemplate(item)"
        >
          <div :class="{'template-item-active': item.tempId === activeTempId}" class="template-item-icon">
            <img :src="item.icon" @error="loadImgError">
          </div>
          <div class="template-item-name">{{ item.title }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { getTemplateList } from '@/api/manage'
import { formatOrderDetail } from '@/utils'
import { getUserId } from '@/utils/auth'
import IconTemplate from './icon_template.png'

export default {
  props: {
    // templateList: {
    //   type: Array,
    //   default: () => []
    // }
  },

  data() {
    const userId = getUserId()
    return {
      userId,
      page: 1,
      number: 10,
      pageTotal: null,
      templateList: [],
      isLoading: false,
      scrollHeight: 0,
      clientHeight: 0,
      activeTempId: 0
    }
  },

  created() {
    this.getTemplateList()
  },

  mounted() {
    this.clientHeight = this.$refs.wrapper.offsetHeight
  },

  updated() {
    this.scrollHeight = this.$refs.wrapper.scrollHeight
  },

  methods: {
    ...mapMutations({
      updateEditData: 'template/UPDATE_EDITDATA',
      updateTempId: 'template/UPDATE_TEMPID'
    }),
    getTemplateList() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const { page, number, userId } = this
      getTemplateList({ page, number, userId }).then((data) => {
        this.pageTotal = data.pageTotal
        data.list.forEach((item) => {
          item.params = formatOrderDetail(item.params)
        })
        this.templateList = data.list
        this.activeTempId = data.list[0].tempId
        this.updateEditData(data.list[0].params)
        this.updateTempId(data.list[0].tempId)
        // this.templateData = data.list[0].params
        loading.close()
      }).catch(() => {
        loading.close()
      })
    },

    getMoreTemp() {
      const { page, number, pageTotal } = this
      const reqPage = page + 1
      if (reqPage > pageTotal || this.isLoading) return
      this.isLoading = true
      getTemplateList({ page: reqPage, number }).then((data) => {
        this.totol = data.total
        data.list.forEach((item) => {
          item.params = formatOrderDetail(item.params)
        })
        this.templateList = this.templateList.concat(data.list)
        this.page++
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    },

    loadImgError(e) {
      e.target.src = IconTemplate
    },

    // loadMore() {
    //   this.$emit('scroll')
    // },

    handlerScroll() {
      const { scrollHeight, clientHeight } = this
      if (scrollHeight <= clientHeight) return
      // eslint-disable-next-line
      const scrollTop = this.$refs.wrapper.scrollTop;
      if (scrollHeight - clientHeight - scrollTop < 100) {
        // this.$emit('scroll')
        this.getMoreTemp()
      }
    },

    chooseTemplate(item) {
      this.activeTempId = item.tempId
      this.updateTempId(item.tempId)
    }
  }
}
</script>

<style lang="scss">
.template {
  text-align: center;
  &-wrap {
    padding-top: 11px;
    width: 144px;
    height: 100%;
    overflow: auto;
    background: #fff;
    box-shadow: 4px 0 6px 0 rgba(23, 63, 126, 0.10);
    &::-webkit-scrollbar {/*滚动条整体样式*/
      width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
    }
  }

  &-title {
    margin-bottom: 33px;
    font-size: 16px;
    color: #4A5470;
    line-height: 22px;
    font-weight: 600;
  }

  &-item {
    margin-bottom: 33px;
    cursor: pointer;
    &-icon {
      margin: 0 auto 8px;
      width: 52px;
      height: 52px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #E7EAEF;
      border-radius: 2px;
      border-radius: 2px;
      img {
        max-width: 30px;
      }
      &-name {
        font-size: 12px;
        color: #666;
        line-height: 16px;
      }
    }
    &-active {
      border: 2px solid #4A5470;
    }
  }
}
</style>
