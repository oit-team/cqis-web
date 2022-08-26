<template>
  <div id="taskList" class="pageCommonStyle">
    <VcSearch
      ref="child"
      style="margin-bottom:26px"
      :head-tit-arr="headTitArr"
      :page-num="pageNum"
      :page-size="pageSize"
      :request-url="requestUrl"
      :other-data="userEmployeeNum"
      @changeLoading="changeLoad"
      @sendData="showChildData"
    />
    <el-divider />
    <el-table
      v-loading="loading"
      style="width: 100%"
      element-loading-text="拼命加载中..."
      :data="tableData"
      border
    >
      <el-table-column
        type="index"
        :index="indexMethod"
        width="50"
      />
      <el-table-column
        v-for="(item, index) in headTitArrNew"
        :key="index"
        show-overflow-tooltip
        sortable
        :min-width="GLOBAL.minCellWidth"
        :prop="item.fieldKey"
        :label="item.fieldName"
      />
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        width="128"
      >
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="详情" placement="top">
            <el-button
              size="mini"
              type="success"
              icon="el-icon-view"
              circle
              @click="$router.push({ name: 'OrderInfo', params: { item: scope.row, host: '' } })"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="pageNum"
      :page-sizes="[15, 20, 30]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
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
      userEmployeeNum: {},
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
    this.requestUrl = this.Api.getWorkList
    if (sessionStorage.headTitString) {
      this.headTitArr = JSON.parse(sessionStorage.headTitString)
      this.userEmployeeNum = {
        userEmployeeNum: sessionStorage.employeeNum,
      }
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
    this.dynamicParam.forEach((el) => {
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
  },
  methods: {
    editRoleItem(item, index) {
      this.editIndex = index
      this.$router.push({
        path: '/role/addrole',
        query: {
          item,
        },
      })
    },
    changeLoad(val) {
      this.loading = val
    },
    showChildData(tableData, total, tableEmptyText, pageNum, body) {
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
      if (total === 0) {
        this.total = 0
        this.pageNum = 1
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.dynamicParam.forEach((el) => {
        if (el.key === 'pageSize') {
          el.value = this.pageSize
        }
      })
      this.$refs.child.parentMsgs(this.dynamicParam)
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.dynamicParam.forEach((el) => {
        if (el.key === 'pageNum') {
          el.value = this.pageNum
        }
      })
      this.$refs.child.parentMsgs(this.dynamicParam)
    },
    addMenu() {
      this.$router.push({
        path: '/role/addRole',
      })
    },
    authUsers(item) {
      this.$router.push({
        path: '/role/authUsersByRoleId',
        query: {
          item,
        },
      })
    },
    indexMethod(index) {
      return (index + 1) + ((this.pageNum - 1) * this.pageSize)
    },
  },
}
</script>
