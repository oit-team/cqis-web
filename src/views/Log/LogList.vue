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
      element-loading-text="拼命加载中..."
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <div class="expandBox">
            <p>
              <span>请求地址:</span>
              {{ props.row.operIp + props.row.operUri }}
            </p>
            <p>
              <span>请求参数:</span>
              {{ props.row.operRequest }}
            </p>
            <p>
              <span>响应参数:</span>
              {{ props.row.operResponse }}
            </p>
          </div>
        </template>
      </el-table-column>
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
    this.requestUrl = this.Api.queryLogs
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
    indexMethod(index) {
      return (index + 1) + ((this.pageNum - 1) * this.pageSize)
    },
  },
}
</script>

<style lang="scss">
  .expandBox{
    padding:0 50px;
    max-width:900px;
    p{
      line-height: 28px;
      span{
        font-weight: bolder;
        margin-right:4px;
      }
    }
  }
</style>
