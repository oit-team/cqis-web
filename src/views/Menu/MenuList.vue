<template>
  <div id="taskList" class="pageCommonStyle">
    <VcSearch
      ref="child"
      style="display:none"
      :head-tit-arr="headTitArr"
      :page-num="pageNum"
      :page-size="pageSize"
      :request-url="requestUrl"
      @changeLoading="changeLoad"
      @sendData="showChildData"
    />
    <div class="operateBtn">
      <el-button v-if="btnRole.indexOf(GLOBAL.btnRole.AddBtn) != -1" size="small" icon="el-icon-plus" type="primary" @click="addMenu">
        新增菜单
      </el-button>
    </div>
    <el-divider />
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="menuId"
      border
      default-expand-all
      :tree-props="{ children: 'childrenMenu', hasChildren: 'true' }"
    >
      <el-table-column
        type="index"
        :index="indexMethod"
        width="50"
      />
      <el-table-column
        v-for="(item, index) in headTitArr"
        :key="index"
        show-overflow-tooltip
        sortable
        :min-width="GLOBAL.minCellWidth"
        :width="item.fieldKey === 'landlineNum' ? '160px' : ''"
        :prop="item.fieldKey"
        :label="item.fieldName"
      />
    </el-table>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <div
        v-for="(tag, index) in dynamicTags"
        :key="index"
        class="tabBox"
      >
        <el-tag
          closable
          :disable-transitions="false"
          @close="handleTagClose(tag)"
        >
          {{ tag.menuName }}
          <i class="el-icon-edit" @click="handleTagEdit(tag, index)"></i>
        </el-tag>
      </div>
      <el-button class="button-new-tag" size="small" @click="showInput">
        + 添加按钮权限
      </el-button>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="addMenuButton">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="菜单权限" :before-close="TagClose" :visible.sync="dialogFormVisible">
      <el-form
        ref="MenuInfo"
        :model="MenuInfo"
        :rules="MenuRules"
      >
        <el-form-item label="按钮名称" label-width="120px" prop="buttonName">
          <el-input v-model.trim="MenuInfo.buttonName" style="width:60%;" autocomplete="off" />
        </el-form-item>
        <el-form-item label="调用地址" label-width="120px" prop="apiUrl">
          <el-input v-model.trim="MenuInfo.apiUrl" style="width:60%;" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="TagClose">
          取 消
        </el-button>
        <el-button type="primary" @click="ChangeMenuInfo">
          确 定
        </el-button>
      </div>
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
      MenuIndex: '',
      MenuInfo: {
        buttonName: '',
        apiUrl: '',
      },
      MenuRules: {
        buttonName: [{ required: true, message: '请输入按钮名称', trigger: 'blur' }],
        apiUrl: [{ required: true, message: '请输入调用地址', trigger: 'blur' }],
      },
      dialogFormVisible: false,
      activeMenuId: [],
      dialogTitle: '',
      dynamicTags: [],
      dialogVisible: false,
      inputValue: '',
      times: 0,
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
    if (btnRole) {
      this.btnRole = btnRole.btnList
    } else {
      this.btnRole = []
    }
    this.requestUrl = this.Api.getAllMenuAndTree
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
    editMenuItem(item, index) {
      this.editIndex = index
      this.$router.push({
        path: '/menu/addmenu',
        query: {
          item,
        },
      })
    },
    delMenuItem(item, index) {
      this.$confirm('确认删除该菜单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const _this = this
        const con = {
          menuId: item.menuId,
        }
        const jsonParam = _this.GLOBAL.paramJson(con)
        _this.$axios.post(_this.Api.delMenuById, jsonParam).then((res) => {
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
      if (total === 0) {
        this.total = 0
        this.pageNum = 1
      }
    },
    addMenu() {
      this.$router.push({
        path: '/menu/addmenu',
      })
    },
    indexMethod(index) {
      return (index + 1) + ((this.pageNum - 1) * this.pageSize)
    },
    authBtn(data) {
      const dynamicTags = []
      if (data.childrenMenu.length > 0) {
        this.dynamicTags = JSON.parse(JSON.stringify(data.childrenMenu))
      }
      if (data.path === '0') {
        this.activeMenuId = data.menuId
      } else {
        this.activeMenuId = `${data.path},${data.menuId}`
      }
      this.dialogTitle = `${data.menuName}按钮权限`
      this.dialogVisible = true
    },
    handleClose() {
      this.dynamicTags = []
      this.dialogVisible = false
    },
    getMenuNameList(data) {
      const arr = []
      data.forEach((item, i) => {
        arr.push({
          buttonName: item.menuName,
          apiUrl: item.apiUrl,
        })
      })
      return arr
    },
    addMenuButton() {
      if (this.dynamicTags.length === 0) {
        this.$message({
          message: '请添加按钮权限',
          type: 'warning',
        })
        return
      }
      const _this = this
      const menuName = this.getMenuNameList(this.dynamicTags)
      const con = {
        pId: this.activeMenuId,
        object: menuName,
        menuType: '2',
      }
      const jsonParam = _this.GLOBAL.paramJson(con)
      _this.$axios.post(_this.Api.addMenuButton, jsonParam).then((res) => {
        if (res.data.head.status === 0) {
          _this.$message({
            message: '编辑按钮权限成功',
            type: 'success',
          })
          _this.handleClose()
          this.$refs.child.parentMsgs(this.dynamicParam)
        } else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      })
    },
    handleTagClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    showInput() {
      this.dialogFormVisible = true
    },
    handleTagEdit(item, index) {
      this.MenuIndex = index
      this.MenuInfo.buttonName = item.menuName
      this.MenuInfo.apiUrl = item.apiUrl
      this.dialogFormVisible = true
    },
    TagClose() {
      this.MenuInfo.buttonName = ''
      this.MenuInfo.apiUrl = ''
      this.MenuIndex = ''
      this.dialogFormVisible = false
    },
    ChangeMenuInfo() {
      this.$refs.MenuInfo.validate((valid) => {
        if (valid) {
          if (this.MenuIndex !== '') {
            this.dynamicTags[this.MenuIndex].menuName = this.MenuInfo.buttonName
            this.dynamicTags[this.MenuIndex].apiUrl = this.MenuInfo.apiUrl
          } else {
            this.dynamicTags.push({
              menuName: this.MenuInfo.buttonName,
              apiUrl: this.MenuInfo.apiUrl,
            })
          }
          this.TagClose()
        }
      })
    },
    isShowBtn(data) {
      if (data.childrenMenu !== null) {
        if (data.childrenMenu.length === 0 && data.menuType === 0) {
          return true
        } if (data.childrenMenu.length > 0 && data.childrenMenu[0].menuType === 2) {
          return true
        }
      }
    },
  },
}
</script>

<style scoped>
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
      width: 90px;
      margin-left: 10px;
      vertical-align: bottom;
    }
    .el-icon-edit{
      padding:2px;
      border-radius:50%;
      cursor:pointer
    }
    .el-icon-edit:hover{
      background:#409eff;
      color:#fff;
    }
    .tabBox{
      display: inline-block;
      margin-left: 10px;
      margin-bottom: 10px;
    }
    .tabBox .input-new-tag{
      margin-left: 0px;
      vertical-align: middle;
    }
</style>
