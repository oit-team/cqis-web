<template>
  <el-popover
    placement="bottom"
    width="250"
    v-model="visible">
    <ol style="max-height: 500px; overflow: auto;">
      <li v-for="item of filterFields" :key="item.fieldKey">
        <el-checkbox :value="!item.noTableShow" @input="$set(item, 'noTableShow', !item.noTableShow)">{{ item.fieldName }}</el-checkbox>
      </li>
    </ol>
    <div style="margin-top: 8px">
      <el-button type="primary" size="mini" @click="onChange()">确定</el-button>
      <el-button size="mini" type="text" @click="visible = false">取消</el-button>
    </div>
    <el-button slot="reference" size="mini" style="padding: 5px;">筛选</el-button>
  </el-popover>
</template>

<script>
export default {
  name: 'Popover',

  props: {
    fields: Array,
  },

  data: () => ({
    filterFields: [],
    visible: false,
  }),

  created() {
    this.filterFields = this.fields.filter(item => !item.noScreening)
    this.onChange()
  },

  methods: {
    onChange() {
      this.$emit('change', this.filterFields.filter(item => !item.noTableShow))
      this.visible = false
    },
  },
}
</script>

<style scoped>

</style>
