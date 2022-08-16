<template>
  <div id="addRole" class="pageCommonStyle">
    <el-page-header :content="title" @back="goBack" />
    <el-divider />
    <el-transfer
      v-model="associatedUser"
      filterable
      filter-placeholder="请输入用户名称"
      :data="allUserList"
      :props="{ key: 'id', label: 'name' }"
      :titles="['未授权用户', '已授权用户']"
      :button-texts="['取消', '授权']"
      @change="handleChange"
    />
  </div>
</template>

<script>
export default {
  name: 'AuthUsersByRoleId',
  props: {},
  data() {
    return {
      title: '用户角色授权',
      roleId: '',
      roleName: '',
      type: '',
      roleRemark: '',
      allUserList: [],
      associatedUser: [],
      leftDefaultChecked: [],
      rightDefaultChecked: [],
    }
  },
  watch: {},
  created() {
    if (this.$route.query.item) {
      this.roleId = this.$route.query.item.roleId
      this.roleName = this.$route.query.item.roleName
      this.roleRemark = this.$route.query.item.roleRemark
      this.type = this.$route.query.item.type
    } else {
      this.roleId = null
    }
    this.title = `${this.title}--${this.roleName}`
  },
  mounted() {
    this.getRoleUserList()
  },
  activated() {},
  methods: {
    handleChange(value, direction, movedKeys) {
      if (direction === 'right') {
        this.addUserAndRole(0, movedKeys)
      } else if (direction === 'left') {
        this.addUserAndRole(1, movedKeys)
      }
    },
    addUserAndRole(type, value) {
      const con = {
        roleIds: this.roleId,
        userIds: value.toString(),
        operateId: type,
        type: this.type,
      }
      let msg = ''
      if (type == 0) {
        msg = '授权'
      } else if (type == 1) {
        msg = '取消授权'
      }
      const jsonParam = this.GLOBAL.paramJson(con)
      const _this = this
      this.$axios.post(_this.Api.addUserAndRole, jsonParam).then((res) => {
        if (res.data.head.status === 0) {
          _this.$message({
            message: `用户角色${msg}成功`,
            type: 'success',
          })
        } else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      })
    },
    getRoleUserList() {
      const con = {
        roleId: this.roleId,
      }
      const jsonParam = this.GLOBAL.paramJson(con)
      const _this = this
      this.$axios.post(_this.Api.getRoleUserList, jsonParam).then((res) => {
        if (res.data.head.status === 0) {
          _this.allUserList = res.data.body.allUser
          _this.associatedUser = res.data.body.isAssociatedUser
        } else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      })
    },
    goBack() {
      this.$router.go(-1)
    },
  },
}
</script>

<style scoped>
  >>>.el-transfer-panel{
    width: 300px;
  }
  >>>.el-button{
    padding:10px 16px;
  }
  >>>.el-checkbox__label{
    font-size:12px;
  }
</style>
