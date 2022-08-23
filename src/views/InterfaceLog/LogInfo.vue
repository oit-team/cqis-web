<template>
  <div id="LogInfo" class="pageCommonStyle">
    <el-page-header :content="title" @back="goBack" />
    <el-divider />
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      label-width="90px"
      label-position="left"
    >
      <el-form-item label="窗口标题">
        <p style="width:80%">
          {{ ruleForm.title }}
        </p>
      </el-form-item>
      <el-form-item label="计算机名">
        <p style="width:80%">
          {{ ruleForm.agent_name }}
        </p>
      </el-form-item>
      <!--      <el-form-item label="日志内容">
        <p style="width:80%">{{ruleForm.content}}</p>
      </el-form-item> -->
      <el-form-item label="应用程序名">
        <p style="width:80%">
          {{ ruleForm.program }}
        </p>
      </el-form-item>
      <el-form-item label="进程描述">
        <p style="width:80%">
          {{ ruleForm.program_desc }}
        </p>
      </el-form-item>
      <el-form-item label="服务IP">
        <p style="width:80%">
          {{ ruleForm.server_ip }}
        </p>
      </el-form-item>
      <el-form-item label="日志内容">
        <p style="width:80%">
          {{ ruleForm.content }}
        </p>
      </el-form-item>
      <el-form-item label="时间">
        <p style="width:80%">
          {{ ruleForm.server_time }}
        </p>
      </el-form-item>
      <el-form-item label="视频">
        <div id="completeDiv">
          <VideoPlay :session-no="sessionNo" :current-host="ruleForm.cdaServiceUrl" :position="ruleForm.offsettime" />
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'LogInfo',
  props: {},
  data() {
    return {
      title: '查看详情',
      ruleForm: '',
    }
  },
  computed: {
    sessionNo() {
      const { videoUrl } = this.$route.query.item
      return videoUrl.match(/sid=(.*?)&/)[1]
    },
  },
  watch: {},
  created() {
    this.$nextTick(function () {
      this.$parent.$parent.$refs.test.$el.scrollTo(0, 0)
    })
    if (this.$route.query.item) {
      this.ruleForm = this.$route.query.item
    }
  },
  mounted() {},
  activated() {},
  methods: {
    goBack() {
      this.$router.go(-1)
    },
  },
}
</script>

<style scoped lang="scss">
#LogInfo {
  display: flex;
  overflow: auto;
  flex-direction: column;
  height: 100%;
  margin-bottom: 0;
}

.el-form {
  flex: 1;
}

#LogInfo p {
  margin: 0px;
}

#completeDiv {
  border: 1px solid #DCDFE6;
}

::v-deep .el-form-item {
  margin-bottom: 0px;
}

::v-deep {
  .j-canvas-inner {
    height: initial!important;
    width: initial!important;
    position: relative!important;
  }
}
</style>
