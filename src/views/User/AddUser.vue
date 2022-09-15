<template>
  <div id="addRole" class="pageCommonStyle">
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
      <el-form-item label="用户工号" prop="employeeNum">
        <el-input v-model="ruleForm.employeeNum" :disabled="editFlag" placeholder="请输入用户工号" style="width:60%;" />
      </el-form-item>
      <el-form-item label="组织名称" prop="job">
        <el-input v-model="ruleForm.job" placeholder="请输入组织名称" style="width:60%;" />
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
  name: 'AddUser',
  props: {},
  data() {
    const isUnique = (rule, value, callback) => {
      const _this = this
      if (!this.editFlag) {
        const chechName = async () => {
          const con = {
            employeeNum: value,
          }
          const jsonParam = _this.GLOBAL.paramJson(con)
          const res = await _this.$axios.post(_this.Api.verifyUserName, jsonParam)
          return res
        }
        chechName().then((res) => {
          if (res.data.head.status !== 0) {
            callback(new Error(res.data.head.msg))
          } else {
            callback()
          }
        })
      } else {
        callback()
      }
    }
    return {
      editFlag: false,
      title: '',
      UserId: '',
      ruleForm: {
        employeeNum: '',
        job: '',
        status: 1,
      },
      rules: {
        employeeNum: [
          { required: true, message: '请输入用户工号', trigger: 'blur' },
          // { validator: isUnique, message: '用户工号重复', trigger: 'blur' },
        ],
        job: [
          { required: true, message: '请输入组织名称', trigger: 'blur' },
        ],
      },
    }
  },
  watch: {},
  created() {
    if (this.$route.query.item) {
      this.title = '编辑用户'
      this.editFlag = true
      this.ruleForm = this.$route.query.item
    } else {
      this.title = '新增用户'
    }
  },
  mounted() {},
  activated() {},
  methods: {
    isUnique() {
      return false
    },
    goBack() {
      this.$router.go(-1)
    },
    changeSex() {},
    submitForm(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          const con = {
            employeeNum: _this.ruleForm.employeeNum,
            name: _this.ruleForm.name,
            job: _this.ruleForm.job,
          }
          if (_this.editFlag) {
            con.id = _this.ruleForm.id
            const jsonParam = _this.GLOBAL.paramJson(con)
            _this.$axios.post(_this.Api.updateUserById, jsonParam).then((res) => {
              if (res.data.head.status === 0) {
                _this.$message({
                  message: '编辑用户成功',
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
          } else {
            const jsonParam = _this.GLOBAL.paramJson(con)
            _this.$axios.post(_this.Api.insertUser, jsonParam).then((res) => {
              if (res.data.head.status === 0) {
                _this.$message({
                  message: '新增用户成功',
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

<style lang="less" scoped>
</style>
