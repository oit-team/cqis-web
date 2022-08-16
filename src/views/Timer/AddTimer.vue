<template>
  <div id="addTimer" class="pageCommonStyle">
    <el-page-header :content="title" @back="goBack" />
    <el-divider />
    <el-form
      ref="ruleForm"
      style="margin-top: 20px"
      :rules="rules"
      :model="ruleForm"
      label-width="90px"
      label-position="left"
    >
      <el-form-item label="任务名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入任务名称" style="width:60%;" />
      </el-form-item>
      <el-form-item label="执行时间" prop="timer">
        <el-select
          v-model="timerType"
          filterable
          placeholder="请选择任务状态"
          style="width:28%"
          @change="timerTypeChange"
        >
          <el-option
            v-for="(item, index) in timerTypeList"
            :key="index"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
        <div v-if="timerType === 1" class="timerItem">
          <span>在</span>
          <el-date-picker
            v-model="ruleForm.timer"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
          />
          <span>执行一次</span>
        </div>
        <div v-if="timerType === 2" class="timerItem">
          <span>每年</span>
          <el-date-picker
            v-model="ruleForm.timer"
            type="datetime"
            value-format="MM-dd HH:mm:ss"
            format="MM-dd HH:mm:ss"
          />
          <span>执行一次</span>
        </div>
        <div v-if="timerType === 3" class="timerItem">
          <span>每月</span>
          <el-date-picker
            v-model="ruleForm.timer"
            type="datetime"
            value-format="dd HH:mm:ss"
            format="dd HH:mm:ss"
          />
          <span>执行一次</span>
        </div>
        <div v-if="timerType === 4" class="timerItem">
          <span>每日</span>
          <el-time-picker
            v-model="ruleForm.timer"
            value-format="HH:mm:ss"
            format="HH:mm:ss"
          />
          <span>执行一次</span>
        </div>
        <div v-if="timerType === 5" class="timerItem">
          <span>每时</span>
          <el-time-picker
            v-model="ruleForm.timer"
            value-format="mm:ss"
            format="mm:ss"
          />
          <span>执行一次</span>
        </div>
        <div v-if="timerType === 6" class="timerItem">
          <span>每隔</span>
          <el-input
            v-model="ruleForm.timer"
            type="text"
            class="timer-input"
          />
          <span>(1-59)分钟执行一次</span>
        </div>
        <div v-if="timerType === 7" class="timerItem">
          <span>每隔</span>
          <el-input
            v-model="ruleForm.timer"
            type="text"
            class="timer-input"
          />
          <span>(1-59)秒执行一次</span>
        </div>
      </el-form-item>
      <el-form-item label="执行地址" prop="content">
        <el-input v-model="ruleForm.content" placeholder="请输入任务执行地址" style="width:60%;" />
      </el-form-item>
      <el-form-item v-if="editFlag" label="任务状态" prop="status">
        <el-select
          v-model="ruleForm.status"
          filterable
          placeholder="请选择任务状态"
          style="width:60%;"
        >
          <el-option
            v-for="(item, index) in statusList"
            :key="index"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务描述" prop="remark">
        <el-input
          v-model="ruleForm.remark"
          type="textarea"
          :rows="4"
          placeholder="请输入任务描述"
          style="width:60%;"
        />
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-check" type="primary" @click="submitForm('ruleForm')">
          保存
        </el-button>
        <el-button v-if="!editFlag" size="small" icon="el-icon-refresh" @click="resetForm('ruleForm')">
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'AddTimer',
  props: {},
  data() {
    return {
      timerType: '',
      timerTypeList: [
        {
          key: 1,
          label: '只执行一次',
        },
        {
          key: 2,
          label: '每年执行一次',
        },
        {
          key: 3,
          label: '每月执行一次',
        },
        {
          key: 4,
          label: '每日执行一次',
        },
        {
          key: 5,
          label: '每小时执行一次',
        },
        {
          key: 6,
          label: '每隔多少分钟执行一次',
        },
        {
          key: 7,
          label: '每隔多少秒执行一次',
        },
      ],
      TreeMenuList: [],
      statusList: [
        {
          key: 0,
          label: '未上线',
        },
        {
          key: 1,
          label: '已上线',
        },
      ],
      editFlag: false,
      title: '',
      ruleForm: {
        name: '',
        timer: '',
        content: '',
        remark: '',
        status: '',
        id: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
        ],
        timer: [
          { required: true, message: '请输入任务执行时间', trigger: 'blur' },
        ],
        content: [
          { required: true, message: '请输入任务执行地址', trigger: 'blur' },
        ],
        remark: [
          { required: true, message: '请输入任务描述', trigger: 'blur' },
        ],
      },
    }
  },
  watch: {},
  created() {
    if (this.$route.query.item) {
      this.title = '编辑定时器'
      this.ruleForm = this.$route.query.item
      this.ruleForm.content = JSON.parse(this.$route.query.item.content).url
      this.timerType = this.timerSeting(this.$route.query.item.timer).type
      this.ruleForm.timer = this.timerSeting(this.$route.query.item.timer).timerCode
      this.editFlag = true
    } else {
      this.title = '新增定时器'
    }
  },
  mounted() {},
  activated() {},
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    timerTypeChange() {
      this.ruleForm.timer = ''
    },
    timerSeting(timer) {
      const array = timer.split(' ')
      let datetimeStr = ''
      let type = -1
      if (array[5] !== '?') {
        datetimeStr = `${array[5]}-`
        type = '1'
      }
      if (array[4] !== '*') {
        datetimeStr = `${datetimeStr}${array[4]}-`
        if (type === -1) {
          type = '2'
        }
      }
      if (array[3] !== '*') {
        datetimeStr = `${datetimeStr}${array[3]} `
        if (type === -1) {
          type = '3'
        }
      }
      if (array[2] !== '*') {
        datetimeStr = `${datetimeStr}${array[2]}:`
        if (type === -1) {
          type = '4'
        }
      }
      if (array[1] !== '*') {
        if (type === -1 && array[0] === '0') {
          const value = array[1]
          if (value.includes('/')) {
            const a = value.split('/')
            datetimeStr = a[1]
            type = '6'
            return { type: Number(type), timerCode: datetimeStr }
          }
        }
        datetimeStr = `${datetimeStr}${array[1]}:`
        if (type === -1) {
          type = '5'
        }
      }
      if (array[0] !== '*') {
        if (type === -1) {
          const last = array[0]
          if (last.includes('/')) {
            const aa = last.split('/')
            datetimeStr = aa[1]
            type = '7'
            return { type: Number(type), timerCode: datetimeStr }
          }
        }
        datetimeStr = `${datetimeStr}${array[0]}`
        if (type === -1) {
          type = '6'
        }
      }
      return { type: Number(type), timerCode: datetimeStr }
    },
    splitTimeStr(timerType, timerStr) {
      let returnStr
      if (timerType === 6) {
        returnStr = `0 0/${timerStr} * * * ?`
      } else if (timerType === 7) {
        returnStr = `0/${timerStr} * * * * ?`
      } else {
        let start = null
        let end = null
        const timerArray = []
        if (timerStr.includes(' ')) {
          const array = timerStr.split(' ')
          if (array.length > 0) {
            start = array[0]
          }
          if (array.length > 1) {
            end = array[1]
          }
        } else {
          end = timerStr
        }
        if (start != null) {
          if (start.includes('-')) {
            const array = start.split('-')
            if (array.length === 1) {
              timerArray.push(null)
              timerArray.push(null)
              timerArray.push(array[0])
            } else if (array.length === 2) {
              timerArray.push(null)
              timerArray.push(array[0])
              timerArray.push(array[1])
            } else if (array.length === 3) {
              timerArray.push(array[0])
              timerArray.push(array[1])
              timerArray.push(array[2])
            }
          } else {
            timerArray.push(null)
            timerArray.push(null)
            timerArray.push(start)
          }
        } else {
          timerArray.push(null)
          timerArray.push(null)
          timerArray.push(null)
        }
        if (end != null) {
          if (end.includes(':')) {
            const array = end.split(':')
            if (array.length === 3) {
              timerArray.push(array[0])
              timerArray.push(array[1])
              timerArray.push(array[2])
            } else if (array.length === 2) {
              timerArray.push(null)
              timerArray.push(array[0])
              timerArray.push(array[1])
            }
          } else {
            timerArray.push(null)
            timerArray.push(null)
            timerArray.push(end)
          }
        } else {
          timerArray.push(null)
          timerArray.push(null)
          timerArray.push(null)
        }
        let has = -1
        for (let i = 0; i < timerArray.length; i++) {
          if (timerArray[i] != null) {
            has = i
            break
          }
        }
        if (has === -1) {
          return null
        }
        for (let i = 0; i < timerArray.length; i++) {
          if (i === 0) {
            if (timerArray[0] === null) {
              returnStr = '?'
            } else {
              returnStr = timerArray[0]
              continue
            }
          } else if (i < has) {
            returnStr = `* ${returnStr}`
            continue
          } else if (timerArray[i] === null) {
            returnStr = `0 ${returnStr}`
          } else {
            returnStr = `${timerArray[i]} ${returnStr}`
          }
        }
      }
      return returnStr
    },
    submitForm(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          const con = {
            name: _this.ruleForm.name,
            timer: _this.splitTimeStr(this.timerType, this.ruleForm.timer),
            content: `{"url":"${_this.ruleForm.content}","param":"0"}`,
            remark: _this.ruleForm.remark,
          }
          if (_this.editFlag) {
            con.Id = _this.ruleForm.id
            con.status = _this.ruleForm.status
            const jsonParam = _this.GLOBAL.paramJson(con)
            _this.$axios.post(_this.Api.addJob, jsonParam).then((res) => {
              if (res.data.head.status === 0) {
                _this.$message({
                  message: '编辑任务成功',
                  type: 'success',
                })
                _this.ruleForm.content = `{"url":"${_this.ruleForm.content}","param":"0"}`
                _this.ruleForm.timer = _this.splitTimeStr(this.timerType, this.ruleForm.timer)
                _this.$bus.$emit('detailShow', _this.ruleForm)
                _this.$router.back()
              } else {
                _this.$message({
                  message: res.data.head.msg,
                  type: 'warning',
                })
              }
            }).catch((err) => {
              console.log(err)
            })
          } else {
            const jsonParam = _this.GLOBAL.paramJson(con)
            _this.$axios.post(_this.Api.addJob, jsonParam).then((res) => {
              if (res.data.head.status === 0) {
                _this.$message({
                  message: '新增任务成功',
                  type: 'success',
                })
                _this.$bus.$emit('detailShow', _this.ruleForm)
                _this.$router.back()
              } else {
                _this.$message({
                  message: res.data.head.msg,
                  type: 'warning',
                })
              }
            }).catch((err) => {
              console.log(err)
            })
          }
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
}
</script>

<style lang="scss" scoped>
  .timerItem{
    display: inline-block;
    width: 56%;
    ::v-deep .el-input{
      width:50%;
    }
    span{
      margin:0 6px;
    }
  }
</style>
