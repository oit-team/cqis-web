<template>
  <el-main ref="test">
    <keep-alive>
      <router-view v-if="$route.meta.keepAliveA" :key="$route.fullPath"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAliveA" :key="$route.fullPath"/>
  </el-main>
</template>

<script>
export default {
  name: 'VcMain',
  methods: {
  },
}
</script>

<style lang="scss" scoped>
.el-main {
  overflow: auto;
  padding: 10px;
}
</style>
