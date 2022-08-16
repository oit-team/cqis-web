<template>
  <div id="customerList" class="pageCommonStyle">
    <vc-search
      ref="child"
      :head-tit-arr="headTitArr"
      :page-num="pageNum"
      :page-size="pageSize"
      :request-url="requestUrl"
      @changeLoading="changeLoad"
      @sendData="showChildData"
    />
    <div class="operateBtn">
      <el-button v-if="btnRole.indexOf(GLOBAL.btnRole.AddBtn) != -1" size="small" icon="el-icon-plus" type="primary" @click="addDepartment">新增部门</el-button>
    </div>
    <el-divider/>
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'childrenDept', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        type="index"
        :index="indexMethod"
        width="50"
      />
      <el-table-column
        v-for="(item,index) in headTitArrNew"
        :key="index"
        show-overflow-tooltip
        sortable
        :min-width="GLOBAL.minCellWidth"
        :width="item.fieldKey==='landlineNum'?'160px':''"
        :prop="item.fieldKey"
        :label="item.fieldName"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="128"
      >
        <template slot-scope="scope">
          <el-tooltip v-if="btnRole.indexOf(GLOBAL.btnRole.EditBtn) != -1" class="item" effect="dark" content="编辑" placement="top">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              class="editBtnOnly"
              circle
              @click="editDepartment(scope.row,scope.$index)"
            />
          </el-tooltip>
          <el-tooltip v-if="btnRole.indexOf(GLOBAL.btnRole.DelBtn) != -1" class="item" effect="dark" content="删除" placement="top">
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              class="delBtnOnly"
              circle
              @click="delDepartment(scope.row,scope.$index)"
            />
          </el-tooltip>
          <el-tooltip v-if="btnRole.indexOf(GLOBAL.btnRole.authBtn) != -1" class="item" effect="dark" content="授权坐席" placement="top">
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-thumb"
              class="authBtnOnly"
              circle
              @click="authCustomer(scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import VcSearch from '../../components/basic/CommonSearch'

export default {
  components: {
    VcSearch,
  },
  props: {
    msg: String,
  },
  data() {
    return {
      total: 0,
      pageNum: 0,
      pageSize: 15,
      requestUrl: '',
      editIndex: null,
      dynamicParam: [],
      loading: true,
      tableData: [],
      headTitArr: [],
      btnRole: [],
    }
  },
  computed: {
    headTitArrNew() {
      return this.headTitArr.filter(item => !item.noTableShow)
    },
  },
  watch: {},
  created() {
    const btnRole = this.$store.state.pageBtnRole.find((el) => {
      return el.menuUrl == this.$route.fullPath
    })
    this.btnRole = btnRole.btnList
    this.requestUrl = this.Api.getDeptList
    if (sessionStorage.headTitString) {
      this.headTitArr = JSON.parse(sessionStorage.headTitString)
    }
    if (this.headTitArr.length <= 0) {
      this.$message({
        message: 'this.headTitArr为空',
        type: 'warning',
      })
    }
    this.dynamicParam = [
      {
        key: 'pageNum',
        value: '1',
        isTrue: true,
        msg: '请确认pageNum',
      },
      {
        key: 'pageSize',
        value: '15',
        isTrue: true,
        msg: '请确认pageSize',
      },
    ]
  },
  mounted() {
    this.pageNum = 1
    this.dynamicParam.forEach(el => {
      if (el.key === 'pageNum') {
        el.value = this.pageNum
      }
    })
    this.$refs.child.parentMsgs(this.dynamicParam)
  },
  activated() {
    if (sessionStorage.headTitString) {
      this.headTitArr = JSON.parse(sessionStorage.headTitString)
    }
    if (this.headTitArr.length <= 0) {
      this.$message({
        message: 'this.headTitArr为空',
        type: 'warning',
      })
    }
    const _this = this
    _this.$bus.$off('detailShow')
    /* 接收参数 */
    _this.$bus.$on('detailShow', (data) => {
      _this.$nextTick(() => {
        _this.$refs.child.resetSearch(_this.dynamicParam, _this.pageNum)
      })
    })
  },
  methods: {
    authCustomer(item) {
      this.$router.push({
        path: '/department/authCustomerByDept',
        query: {
          item,
        },
      })
    },
    editDepartment(item, index) {
      this.editIndex = index
      this.$router.push({
        path: '/department/adddepartment',
        query: {
          item,
        },
      })
    },
    delDepartment(item, index) {
      this.$confirm('确认删除该部门?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const _this = this
        const con = {
          id: item.id,
          dCode: item.deptCode,
        }
        const jsonParam = _this.GLOBAL.paramJson(con)
        _this.$axios.post(_this.Api.delDept, jsonParam).then((res) => {
          if (res.data.head.status === 0) {
            _this.$refs.child.parentMsgs(_this.dynamicParam)
            _this.$message({
              type: 'success',
              message: '删除成功!',
            })
          } else {
            _this.$message({
              type: 'error',
              message: res.data.head.msg,
            })
          }
        })
      }).catch(() => {
      })
    },
    changeLoad(val) {
      this.loading = val
    },
    showChildData(tableData, total, tableEmptyText, pageNum) {
      if (tableData) {
        this.tableData = tableData
      }
      if (total) {
        this.total = total
      }
      if (tableEmptyText) {
        this.tableEmptyText = tableEmptyText
      }
      if (pageNum) {
        this.pageNum = pageNum
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.dynamicParam.forEach(el => {
        if (el.key === 'pageSize') {
          el.value = this.pageSize
        }
      })
      this.$refs.child.parentMsgs(this.dynamicParam)
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.dynamicParam.forEach(el => {
        if (el.key === 'pageNum') {
          el.value = this.pageNum
        }
      })
      this.$refs.child.parentMsgs(this.dynamicParam)
    },
    addDepartment() {
      this.$router.push({
        path: '/department/adddepartment',
      })
    },
    indexMethod(index) {
      return (index + 1) + ((this.pageNum - 1) * this.pageSize)
    },
  },
}
</script>
