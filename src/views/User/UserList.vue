<template>
  <div id="taskList" class="pageCommonStyle">
    <VcSearch
      ref="child"
      :head-tit-arr="headTitArr"
      :page-num="pageNum"
      :page-size="pageSize"
      :request-url="requestUrl"
      @changeLoading="changeLoad"
      @sendData="showChildData"
    />
    <div class="operateBtn">
      <el-button v-if="btnRole.indexOf(GLOBAL.btnRole.AddBtn) != -1" size="small" icon="el-icon-plus" type="primary" @click="addUser">
        新增用户
      </el-button>
      <el-button icon="el-icon-download" size="small" type="success" @click="dialogVisible = true">
        导入用户
      </el-button>
    </div>
    <el-divider></el-divider>
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中..."
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        type="index"
        :index="indexMethod"
        width="50"
      >
      </el-table-column>
      <el-table-column
        v-for="(item, index) in headTitArrNew"
        :key="index"
        show-overflow-tooltip
        sortable
        :min-width="GLOBAL.minCellWidth"
        :prop="item.fieldKey"
        :label="item.fieldName"
      >
        <template v-if="item.fieldKey === 'status'" scope="scopeStatus">
          <span v-if="scopeStatus.row.status === 1">有效</span>
          <span v-else-if="scopeStatus.row.status === 2">无效</span>
        </template>
        <template v-else-if="item.fieldKey === 'accountType'" scope="scope">
          <span v-if="scope.row.accountType === 2">临时用户</span>
          <span v-else-if="scope.row.accountType === 1">正式用户</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-tooltip v-if="btnRole.indexOf(GLOBAL.btnRole.EditBtn) != -1" class="item" effect="dark" content="编辑" placement="top">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              class="editBtnOnly"
              circle
              @click="editUserItem(scope.row, scope.$index)"
            ></el-button>
          </el-tooltip>
          <el-tooltip v-if="btnRole.indexOf(GLOBAL.btnRole.DelBtn) != -1" class="item" effect="dark" content="删除" placement="top">
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              class="delBtnOnly"
              circle
              @click="delUserItem(scope.row, scope.$index)"
            >
            </el-button>
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
    >
    </el-pagination>
    <el-dialog
      title="导入用户"
      :visible.sync="dialogVisible"
      :close-on-click-modal="true"
      width="60%"
      :before-close="handleClose"
    >
      <div>
        <el-upload
          ref="upload"
          class="upload-demo"
          accept=".xlsx,.xls"
          :limit="1"
          :on-exceed="handleExceed"
          :show-file-list="true"
          :auto-upload="false"
          :file-list="fileList"
          :data="UploadData"
          :action="UploadAction"
          :before-upload="BeforeUpload"
          :on-success="OnSuccess"
          :on-error="OnError"
        >
          <el-button size="small" type="primary">
            选取文件
          </el-button>
          <div slot="tip" class="el-upload__tip">
            <span><a :href="downLoadUrl">点击下载模板</a> , </span>只能上传xlsx/xls文件，且不超过2MB
          </div>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitUpload">确 定</el-button>
      </span>
    </el-dialog>
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
      downLoadUrl: '',
      fileList: [],
      dialogVisible: false,
      UploadData: {
        userId: '',
        de: sessionStorage.de,
        chcode: sessionStorage.accessToken,
      },
      UploadAction: '',
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
    this.requestUrl = this.Api.getAllUsers
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
    this.downLoadUrl = this.Api.userTemplate
    this.UploadAction = this.Api.importDataInfo
    this.UploadData.userId = sessionStorage.aid
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
    if (!this.headTitArr) {
      this.$message({
        message: 'this.headTitArr为空',
        type: 'warning',
      })
    }
    const _this = this
    _this.$bus.$off('detailShow')
    /* 接收参数 */
    _this.$bus.$on('detailShow', (data) => {
      if (!data.id) {
        _this.$nextTick(() => {
          _this.$refs.child.resetSearch(_this.dynamicParam, _this.pageNum)
        })
      } else {
        _this.$set(_this.tableData, _this.editIndex, data)
      }
    })
  },
  methods: {
    editUserItem(item, index) {
      this.editIndex = index
      this.$router.push({
        path: '/user/adduser',
        query: {
          item,
        },
      })
    },
    delUserItem(item, index) {
      this.$confirm('确认删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const _this = this
        const con = {
          id: item.id,
        }
        const jsonParam = _this.GLOBAL.paramJson(con)
        _this.$axios.post(_this.Api.delUserById, jsonParam).then((res) => {
          if (res.data.head.status === 0) {
            _this.tableData.splice(index, 1)
            if (_this.total > 0) {
              _this.total -= 1
            }
            if (_this.tableData.length === 0 && _this.total > 0) {
              _this.pageNum -= 1
              _this.dynamicParam.forEach((el) => {
                if (el.key === 'pageNum') {
                  el.value = _this.pageNum
                }
              })
              _this.$refs.child.parentMsgs(_this.dynamicParam)
            }
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
    addUser() {
      this.$router.push({
        path: '/user/adduser',
      })
    },
    indexMethod(index) {
      return (index + 1) + ((this.pageNum - 1) * this.pageSize)
    },
    BeforeUpload(file) {
      const pointIndex = file.name.lastIndexOf('.')
      const fileType = file.name.substring(pointIndex + 1) // 获取到文件后缀名
      const isXlsx = fileType === 'xlsx' || fileType === 'xls'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isXlsx) {
        this.$message.error('上传文件只能是xlsx/xls格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 2MB!')
      }
      return isXlsx && isLt2M
    },
    OnSuccess(res) {
      this.handleClose()
      if (res.head.status === 0) {
        this.$message({
          message: res.head.msg,
          type: 'success',
        })
      } else if (res.body) {
        const h = this.$createElement
        this.$msgbox({
          title: '错误消息',
          message: h('ul', {
            style: {
              maxHeight: '500px',
              overflow: 'auto',
            },
          }, res.body.msgList.map(item => h('li', item))),
          confirmButtonText: '确定',
        })
      } else {
        this.$message({
          message: res.head.msg,
          type: 'error',
        })
      }
    },
    OnError(res) {
      this.$message({
        message: res.head.msg,
        type: 'success',
      })
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handleClose() {
      this.fileList = []
      this.dialogVisible = false
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
  },
}
</script>

<style lang="scss" scoped>
.upload-demo{
  display: inline-block;
  margin-left:10px;
  ::v-deep a{
    text-decoration: none;
    color:#409EFF;

  }
}
</style>
