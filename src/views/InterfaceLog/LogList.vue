<template>
  <div id="taskList" class="pageCommonStyle">
    <VcSearch
      ref="child"
      style="margin-bottom:26px"
      :head-tit-arr="headTitArr"
      :page-num="pageNum"
      :page-size="pageSize"
      :request-url="requestUrl"
      :other-data="{
        keyword,
        keywordType,
      }"
      @changeLoading="changeLoad"
      @sendData="showChildData"
      @clear="() => {
        keyword = ''
        keywordType = ''
      }"
    >
      <template v-slot:field:keyword>
        <el-input
          class="keyword-input"
          v-model="keyword"
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          clearable
        >
          <el-select slot="prepend" v-model="keywordType" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option :label="item.dictitemValue" :value="item.dictitemKey" v-for="item of typeList" :key="item.dictitemKey"></el-option>
          </el-select>
        </el-input>
      </template>
    </VcSearch>
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
        width="60"
      >
        <template slot="header">
          <FieldsFilterPopover :fields="headTitArr" @change="headTitArrNew = $event" />
        </template>
      </el-table-column>
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
              @click="LogInfo(scope.row, scope.$index)"
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
import FieldsFilterPopover from './components/FieldsFilterPopover'

export default {
  components: {
    VcSearch,
    FieldsFilterPopover,
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
      headTitArrNew: [],
      userEmployeeNum: {},
      btnRole: [],
      keyword: '',
      keywordType: '',
      typeList: [],
    }
  },
  watch: {},
  created() {
    const btnRole = this.$store.state.pageBtnRole.find((el) => {
      return el.menuUrl == this.$route.fullPath
    })
    this.btnRole = btnRole.btnList
    this.requestUrl = this.Api.callInterface
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
    this.dynamicParam.forEach((el) => {
      if (el.key === 'pageNum') {
        el.value = this.pageNum
      }
    })
    this.$refs.child.parentMsgs(this.dynamicParam)
    this.getKeywordType()
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
    getKeywordType() {
      this.$axios.post(this.Api.getDictitemInfo, this.GLOBAL.paramJson({})).then((res) => {
        if (res.data.head.status === 0) {
          this.typeList = res.data.body.resultList
        }
      })
    },
    LogInfo(item, index) {
      this.$router.push({
        path: '/interfacelog/loginfo',
        query: {
          item,
        },
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
    max-width:900px;
    padding:0 50px;
    p{
      line-height: 28px;
      span{
        font-weight: bolder;
        margin-right:4px;
      }
    }
  }

  .keyword-input .el-select .el-input__inner {
    width: 130px;
    padding: 0 30px 0 10px;
  }
</style>
