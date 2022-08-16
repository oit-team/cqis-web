<template>
  <div id="addRole" class="pageCommonStyle">
    <el-page-header :content="title" @back="goBack"/>
    <el-divider/>
    <el-form
      ref="ruleForm"
      style="margin-top: 20px"
      :rules="rules"
      :model="ruleForm"
      label-width="90px"
      label-position="left"
    >
      <el-form-item label="部门名称" prop="deptName">
        <el-input v-model="ruleForm.deptName" placeholder="部门名称" style="width:60%;"/>
      </el-form-item>
      <el-form-item label="父级部门" prop="path">
        <el-cascader
          v-model="ruleForm.path"
          :disabled="editFlag"
          placeholder="请选择父级部门(不选默认添加根部门)"
          :options="DeptOptions"
          :props="{ checkStrictly: true, value: 'deptCode', label: 'deptName', children: 'childrenDept'}"
          clearable
        />
      </el-form-item>
      <el-form-item label="部门描述" prop="deptRemark">
        <el-input
          v-model="ruleForm.deptRemark"
          type="textarea"
          :rows="4"
          placeholder="部门描述"
          style="width:60%;"
        />
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
      DeptOptions: [],
      DeptPath: [],
      editFlag: false,
      title: '',
      UserId: '',
      ruleForm: {
        deptName: '',
        deptRemark: '',
        path: [],
      },
      rules: {
        deptName: [
          { required: true, message: '请选输入部门名称', trigger: 'blur' },
        ],
        deptRemark: [
          { required: true, message: '请输入部门描述', trigger: 'blur' },
        ],
      },
    }
  },
  watch: {},
  created() {
    if (this.$route.query.item) {
      this.title = '编辑部门'
      this.editFlag = true
      this.$route.query.item.path = this.$route.query.item.path === '0' ? '' : this.$route.query.item.path.split(',')
      this.ruleForm = this.$route.query.item
    } else {
      this.title = '新增部门'
    }
    this.getDeptList()
  },
  mounted() {},
  activated() {},
  methods: {
    getDeptList() {
      const con = {
      }
      const jsonParam = this.GLOBAL.paramJson(con)
      const _this = this
      this.$axios.post(_this.Api.getDeptTree, jsonParam).then((res) => {
        _this.DeptOptions = _this.getTreeData(res.data.body.resultMap)
      })
    },
    getTreeData(data) {
      data.forEach((item, i) => {
        if (item.deptCode === this.ruleForm.deptCode) {
          item.disabled = true
        }
        if (item.childrenDept.length < 1) {
          item.childrenDept = null
        } else {
          this.getTreeData(item.childrenDept)
        }
      })
      return data
    },
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
          const path = _this.ruleForm.path.length > 0 ? _this.ruleForm.path.toString() : '0'
          const con = {
            deptName: _this.ruleForm.deptName,
            deptRemark: _this.ruleForm.deptRemark,
            path,
          }
          if (_this.editFlag) {
            con.id = _this.ruleForm.id
            const jsonParam = _this.GLOBAL.paramJson(con)
            _this.$axios.post(_this.Api.updateDept, jsonParam).then((res) => {
              if (res.data.head.status === 0) {
                _this.$message({
                  message: '编辑部门成功',
                  type: 'success',
                })
                _this.ruleForm.path = _this.ruleForm.path.toString()
                _this.$bus.$emit('detailShow', _this.ruleForm)
                _this.$router.back()
              } else {
                _this.$message({
                  message: res.data.head.msg,
                  type: 'warning',
                })
              }
            }).catch(err => {
              console.log(err)
            })
          } else {
            const jsonParam = _this.GLOBAL.paramJson(con)
            _this.$axios.post(_this.Api.insertDept, jsonParam).then((res) => {
              if (res.data.head.status === 0) {
                _this.$message({
                  message: '新增部门成功',
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
            }).catch(err => {
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
