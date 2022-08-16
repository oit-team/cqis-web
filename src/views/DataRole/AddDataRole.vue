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
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="ruleForm.roleName" placeholder="角色名称" style="width:60%;" />
      </el-form-item>
      <el-form-item label="角色描述" prop="roleRemark">
        <el-input
          v-model="ruleForm.roleRemark"
          type="textarea"
          :rows="4"
          placeholder="角色描述"
          style="width:60%;"
        />
      </el-form-item>
      <el-form-item label="部门">
        <el-tree
          ref="tree"
          :data="TreeDeptList"
          :default-expand-all="true"
          show-checkbox
          :default-checked-keys="defaultCheck"
          node-key="deptCode"
          :props="defaultProps"
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
  name: 'AddUser',
  props: {},
  data() {
    return {
      defaultProps: {
        label: 'deptName',
        children: 'childrenDept',
      },
      defaultCheck: [],
      TreeDeptList: [],
      editFlag: false,
      title: '',
      UserId: '',
      ruleForm: {
        roleName: '',
        roleRemark: '',
      },
      rules: {
        roleName: [
          { required: true, message: '请选输入角色名称', trigger: 'blur' },
        ],
        roleRemark: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
        ],
      },
    }
  },
  watch: {},
  created() {
    if (this.$route.query.item) {
      this.title = '编辑数据角色'
      this.editFlag = true
      // this.$route.query.item.path = this.$route.query.item.path === '0' ? '' : this.$route.query.item.path
      this.ruleForm = this.$route.query.item
      this.getRoleDeptList()
    } else {
      this.title = '新增数据角色'
    }
    this.getDeptTree()
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
            roleName: _this.ruleForm.roleName,
            roleRemark: _this.ruleForm.roleRemark,
            deptCodes: _this.$refs.tree.getCheckedKeys().toString(),
          }
          if (_this.editFlag) {
            con.id = _this.ruleForm.id
            con.roleCode = _this.ruleForm.roleCode
            const jsonParam = _this.GLOBAL.paramJson(con)
            _this.$axios.post(_this.Api.updateDataRole, jsonParam).then((res) => {
              if (res.data.head.status === 0) {
                _this.$message({
                  message: '编辑数据角色成功',
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
            _this.$axios.post(_this.Api.insertDataRole, jsonParam).then((res) => {
              if (res.data.head.status === 0) {
                _this.$message({
                  message: '新增数据角色成功',
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
    getDeptTree() {
      const con = {}
      const jsonParam = this.GLOBAL.paramJson(con)
      const _this = this
      this.$axios.post(_this.Api.getDeptTree, jsonParam).then((res) => {
        _this.TreeDeptList = res.data.body.resultMap
      })
    },
    getRoleDeptList() {
      const con = {
        roleCode: this.ruleForm.roleCode,
      }
      const jsonParam = this.GLOBAL.paramJson(con)
      const _this = this
      this.$axios.post(_this.Api.getRoleDeptList, jsonParam).then((res) => {
        _this.defaultCheck = res.data.body.isAssociatedDept
      })
    },
  },
}
</script>

<style lang="less" scoped>
</style>
