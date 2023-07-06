<template>
  <div id="addRole" class="pageCommonStyle">
    <el-page-header :content="title" @back="goBack" />
    <el-divider />
    <el-form
      ref="ruleForm"
      style="{margin-top: 20px; width: 60%;}"
      :rules="rules"
      :model="ruleForm"
      label-width="90px"
      label-position="right"
    >
      <el-form-item label="用户工号" prop="employeeNum">
        <el-input v-model="ruleForm.employeeNum" :disabled="editFlag" placeholder="请输入用户工号" style="width:100%;" />
      </el-form-item>
      <el-form-item label="组织名称" prop="job">
        <el-input v-model="ruleForm.job" placeholder="请输入组织名称" style="width:100%;" />
      </el-form-item>
      <el-form-item label="准入Ip">
        <el-tag
          v-for="tag in ipTagsList"
          :key="tag"
          closable
          :disable-transitions="false"
          @close="deleteIpTagsItem(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          v-if="inputTagsVisible"
          ref="saveTagInput"
          v-model="addTagValue"
          class="input-new-tag"
          size="small"
          @keyup.enter.native="handleInputTagsConfirm"
          @blur="handleInputTagsConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInputTags">
          新增
        </el-button>
      </el-form-item>
      <el-form-item label="CDA部门" prop="orgId">
        <el-select v-model="ruleForm.orgId" placeholder="请选择所属部门" style="width:100%;">
          <el-option
            v-for="item in cdaOrgDefList"
            :key="item.orgId"
            :label="item.orgName"
            :value="item.orgId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="CDA角色" prop="roleId">
        <el-select v-model="ruleForm.roleId" placeholder="请选择所属角色" style="width:100%;">
          <el-option
            v-for="item in cdaOrgRoleList"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="系统角色" prop="roleId">
        <el-select v-model="ruleForm.rId" placeholder="请选择系统角色" style="width:100%;">
          <el-option
            v-for="item in roleList"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="员工姓名">
        <el-input v-model="ruleForm.name" placeholder="请输入员工姓名" style="width:100%;" />
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
        reqIp: '',
        roleId: '', // CDA角色
        orgId: '', // CDA部门
        rId: '', // 系统角色
        name: '',
      },
      cdaOrgDefList: [],
      cdaOrgRoleList: [],
      roleList: [],
      inputTagsVisible: false,
      addTagValue: '',
      ipTagsList: [],
      rules: {
        employeeNum: [
          { required: true, message: '请输入用户工号', trigger: 'blur' },
          // { validator: isUnique, message: '用户工号重复', trigger: 'blur' },
        ],
        job: [
          { required: true, message: '请输入组织名称', trigger: 'blur' },
        ],
        // reqIp: [
        //   { required: true, message: '请添加准入Ip', trigger: 'blur' },
        // ],
        orgId: [
          { required: true, message: '请选择CAD部门', trigger: 'blur' },
        ],
        roleId: [
          { required: true, message: '请输入CAD角色', trigger: 'blur' },
        ],
        rId: [
          { required: true, message: '请输入系统角色', trigger: 'blur' },
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
      // 反显tag的时候将最后的逗号去掉
      const ipTags = this.ruleForm.reqIp.split(',')
      this.ipTagsList = ipTags.slice(0, ipTags.length - 1)
    } else {
      this.title = '新增用户'
    }
  },
  mounted() {
    this.getCdaOrgDef()
    this.getCdaRoleIds()
    this.getRoleUser()
  },
  activated() {},
  methods: {
    isUnique() {
      return false
    },
    goBack() {
      this.$router.go(-1)
    },
    changeSex() {},

    deleteIpTagsItem(tag) {
      this.ipTagsList.splice(this.ipTagsList.indexOf(tag), 1)
    },

    showInputTags() {
      this.inputTagsVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputTagsConfirm() {
      const addTagValue = this.addTagValue
      if (addTagValue) {
        this.ipTagsList.push(addTagValue)
      }
      this.inputTagsVisible = false
      this.addTagValue = ''
    },

    getCdaOrgDef() {
      const con = {
        employeeNum: this.ruleForm.employeeNum,
      }
      const jsonParam = this.GLOBAL.paramJson(con)

      this.$axios.post(this.Api.getCdaOrgDef, jsonParam).then((res) => {
        if (res.data.head.status === 0) {
          const result = res.data.body
          this.cdaOrgDefList = result.resultMap
          this.$set(this.ruleForm, 'orgId', result.userOrgId || '')
        } else {
          this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },

    getRoleUser() {
      const con = {
        userId: this.ruleForm.id,
      }
      const jsonParam = this.GLOBAL.paramJson(con)

      this.$axios.post(this.Api.getRoleUser, jsonParam).then((res) => {
        if (res.data.head.status === 0) {
          const result = res.data.body
          this.roleList = result.resultList
          this.$set(this.ruleForm, 'rId', result.isAssociatedRole || '')
        } else {
          this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },

    getCdaRoleIds() {
      const con = {
        employeeNum: this.ruleForm.employeeNum,
      }
      const jsonParam = this.GLOBAL.paramJson(con)

      this.$axios.post(this.Api.getCdaRoleIds, jsonParam).then((res) => {
        if (res.data.head.status === 0) {
          const result = res.data.body
          this.cdaOrgRoleList = result.resultList
          this.$set(this.ruleForm, 'roleId', result.userRoleId || '')
        } else {
          this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },

    submitForm(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ipTagsList.length === 0) {
            this.$message({
              message: '准入IP不能为空！请填写',
              type: 'warning',
            })
            return
          }
          const con = {
            employeeNum: _this.ruleForm.employeeNum,
            name: _this.ruleForm.name,
            job: _this.ruleForm.job,
            orgId: _this.ruleForm.orgId,
            roleId: _this.ruleForm.roleId,
            rId: _this.ruleForm.rId,
            reqIp: `${this.ipTagsList.join()},`, // 提交的时候tags最后那个逗号要加上
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

<style lang="scss" scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 120px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
