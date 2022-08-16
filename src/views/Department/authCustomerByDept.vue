<template>
  <div id="addRole" class="pageCommonStyle">
    <el-page-header :content="title" @back="goBack"/>
    <el-divider/>
    <el-transfer
      v-model="associatedCustomer"
      filterable
      filter-placeholder="请输入用户名称"
      :data="allCustomerList"
      :props="{key:'employeeNum',label:'name'}"
      :titles="['未授权坐席', '已授权坐席']"
      :button-texts="['取消', '授权']"
      @change="handleChange"
    />
  </div>
</template>

<script>
export default {
  name: 'AuthCustomerByDept',
  props: {},
  data() {
    return {
      title: '部门坐席授权',
      deptCode: '',
      deptName: '',
      deptRemark: '',
      allCustomerList: [],
      associatedCustomer: [],
      leftDefaultChecked: [],
      rightDefaultChecked: [],
    }
  },
  watch: {},
  created() {
    if (this.$route.query.item) {
      this.deptCode = this.$route.query.item.deptCode
      this.deptName = this.$route.query.item.deptName
      this.deptRemark = this.$route.query.item.deptRemark
    } else {
      this.deptCode = null
    }
    this.title = `${this.title}--${this.deptName}`
  },
  mounted() {
    this.getDeptCustomerList()
  },
  activated() {},
  methods: {
    handleChange(value, direction, movedKeys) {
      if (direction === 'right') {
        this.addDeptAndCustomer(0, movedKeys)
      } else if (direction === 'left') {
        this.addDeptAndCustomer(1, movedKeys)
      }
    },
    addDeptAndCustomer(type, value) {
      const con = {
        deptCodes: this.deptCode,
        employeeNums: value.toString(),
        operateId: type,
      }
      const jsonParam = this.GLOBAL.paramJson(con)
      const _this = this
      this.$axios.post(_this.Api.addDeptAndCustomer, jsonParam).then((res) => {
        if (res.data.head.status === 0) {
          _this.$message({
            message: '用户角色授权成功',
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
    getDeptCustomerList() {
      const con = {
        deptCode: this.deptCode,
      }
      const jsonParam = this.GLOBAL.paramJson(con)
      const _this = this
      this.$axios.post(_this.Api.getDeptCustomerList, jsonParam).then((res) => {
        if (res.data.head.status === 0) {
          _this.allCustomerList = res.data.body.allCustomer
          _this.associatedCustomer = res.data.body.isAssociatedCustomer
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
