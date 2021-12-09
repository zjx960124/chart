<template>
  <el-dialog
    v-dialogDrag
    :close-on-click-modal="false"
    title="cron表达式"
    v-bind="$attrs"
    width="800px"
    custom-class="formClass"
    :before-close="close"
    append-to-body
    @open="open"
    v-on="$listeners"
  >
    <JsCron
      ref="jsCron"
      :expression="expression"
      @hide="close"
      @fill="changeCron"
    />
  </el-dialog>
</template>

<script>
import JsCron from '@/components/JsCron'

export default {
  components: { JsCron },
  props: {
    expression: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  watch: {
    expression(newData, oldData) {
      this.expression = newData
    }
  },
  methods: {
    open() {
      this.$nextTick(() => {
        this.$refs['jsCron'].resolveExp()
      })
    },
    close() {
      this.$refs['jsCron'].clearCron()
      this.$emit('update:visible', false)
    },
    changeCron(val) {
      this.$emit('changeCron', val)
    }
  }
}
</script>

<style scoped>
</style>

