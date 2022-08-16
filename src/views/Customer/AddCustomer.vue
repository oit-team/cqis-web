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
      <el-form-item label="工号" prop="employeeNum">
        <el-input v-model="ruleForm.employeeNum" style="width:60%;" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="ruleForm.name" style="width:60%;" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="座机号" prop="landlineNum">
        <el-input v-model="ruleForm.landlineNum" style="width:60%;" placeholder="请输入座机号" />
      </el-form-item>
      <el-form-item label="部门" prop="deptCode">
        <el-cascader
          v-model="ruleForm.deptCode"
          :options="tree"
          :props="{
            checkStrictly: true,
            label: 'deptName',
            children: 'childrenDept',
            value: 'deptCode',
            emitPath: false,
          }"
        ></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-check" type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button v-if="!editFlag" size="small" icon="el-icon-refresh" @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'AddUser',
  props: {},
  data() {
    return {
      editFlag: false,
      title: '',
      UserId: '',
      ruleForm: {
        employeeNum: '',
        name: '',
        landlineNum: '',
        deptCode: '',
      },
      rules: {
        employeeNum: [
          {
            required: true,
            message: '请选输入工号',
            trigger: 'blur',
          },
        ],
        name: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur',
          },
        ],
        landlineNum: [
          {
            required: true,
            message: '请输入座机号',
            trigger: 'blur',
          },
        ],
        deptCode: [
          {
            required: true,
            message: '请输入部门',
            trigger: 'blur',
          },
        ],
      },
      tree: [],
    }
  },
  watch: {},
  created() {
    if (this.$route.query.item) {
      this.title = '编辑坐席'
      this.editFlag = true
      this.$route.query.item.path = this.$route.query.item.path === '0' ? '' : this.$route.query.item.path
      this.ruleForm = this.$route.query.item
    } else {
      this.title = '新增坐席'
    }

    const jsonParam = this.GLOBAL.paramJson({})
    this.$axios.post(this.Api.getDeptTree, jsonParam)
      .then((res) => {
        this.tree = res.data.body.resultMap
      })
      .catch(err => {
        console.log(err)
      })
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
    changeMenuType() {},
    submitForm(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          const con = {
            employeeNum: _this.ruleForm.employeeNum,
            name: _this.ruleForm.name,
            landlineNum: _this.ruleForm.landlineNum,
            deptCode: _this.ruleForm.deptCode,
          }
          if (_this.editFlag) {
            con.id = _this.ruleForm.id
            const jsonParam = _this.GLOBAL.paramJson(con)
            _this.$axios.post(_this.Api.updateCustomer, jsonParam)
              .then((res) => {
                if (res.data.head.status === 0) {
                  _this.$message({
                    message: '编辑坐席成功',
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
              })
              .catch(err => {
                console.log(err)
              })
          } else {
            const jsonParam = _this.GLOBAL.paramJson(con)
            _this.$axios.post(_this.Api.insertCustomer, jsonParam)
              .then((res) => {
                if (res.data.head.status === 0) {
                  _this.$message({
                    message: '新增坐席成功',
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
              })
              .catch(err => {
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
