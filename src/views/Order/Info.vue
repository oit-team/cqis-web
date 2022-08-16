<template>
  <div class="pageCommonStyle">
    <el-page-header content="查看详情" @back="$router.back()" />
    <el-divider />
    <div class="grid grid-cols-2 xl:grid-cols-3 gap-2">
      <div v-for="field of fields" :key="field.fieldKey" class="flex">
        <span class="w-7em">{{ field.fieldName }}</span>
        <span>{{ item[field.fieldKey] }}</span>
      </div>
    </div>
    <el-divider />
    <div>
      <figure v-if="item._playRemark.audio" class="pb-4">
        <figcaption class="text-lg font-bold mb-2">
          语音：
        </figcaption>
        <audio
          class="w-1/2"
          controls
          :src="item._playRemark.audio[0].audioPlayUrl"
        >
        </audio>
      </figure>
      <figure v-if="item._playRemark.video">
        <figcaption class="text-lg font-bold mb-2">
          视频：
        </figcaption>
        <VideoPlay class="border border-gray-500" :session-no="item._playRemark.video[0].sessionNo" :current-host="item.cdaVideoServiceUrl" />
      </figure>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderInfo',

  data: () => ({
    item: {},
  }),

  activated() {
    const title = JSON.parse(sessionStorage.getItem('headTitString'))
    const keys = [
      'custNo',
      'workSheetNo',
      'custName',
      'mediaDetail',
      'ffpNo',
      'callType',
      'ivrServiceType',
      'callName',
      'beginTime',
      'endTime',
    ]

    this.fields = title.filter(item => keys.includes(item.fieldKey))
    this.item = this.$route.params.item || {}
    this.item._playRemark = this.item.playRemark ? JSON.parse(this.item.playRemark) : {}
  },
}
</script>

<style lang="scss" scoped>
.pageCommonStyle {
  height: 100%;
}

::v-deep {
  .j-canvas-inner {
    height: initial!important;
    width: initial!important;
    position: relative!important;
  }
}
</style>
