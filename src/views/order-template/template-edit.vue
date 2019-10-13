<template>
  <div class="edit">
    <div class="dashboard-text">name: {{ name }}</div>
  </div>
</template>

<script>
export default {
  name: 'TemplateEdit',
  props: {
    type: {
      type: Number,
      required: true
    },
    templateContent: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      templateData: {}
    }
  },
  watch: {
    templateContent: {
      handler(val) {

      },
      immediate: true
    }
  },
  methods: {
    
  }
}
</script>

<style lang="scss" scoped>

</style>
