<template>
  <div class="about">
    <div class="iframeBox">
      <iframe id="iframe" scrolling="auto" frameborder="0" class="trend-container2" :src="iframeUrl"></iframe>
      <VcAudio />
    </div>
  </div>
</template>

<script>
import VcAudio from '@/components/basic/VueAudio'

export default {
  name: 'About',
  components: {
    VcAudio,
  },
  props: {},
  data() {
    return {
      iframeUrl: 'https://10.79.3.67/console/play/video?sid=c93ba7f7-fef0-408c-b2a5-a88a3fb7586b',
    }
  },
  created() {
  },
}
</script>

<style lang="scss" scoped>
  #iframe{
    width:635px;
    height:570px;
  }
  .about{
    height: 100vh;
    overflow:auto;
  }
  .iframeBox{
    width: 655px;
    padding:10px;
    overflow:hidden;
    height: 1000px;
  }
</style>
