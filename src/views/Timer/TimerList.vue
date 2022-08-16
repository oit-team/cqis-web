<template>
  <div id="taskList" class="pageCommonStyle">
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
      <el-button v-if="btnRole.indexOf(GLOBAL.btnRole.AddBtn) != -1" size="small" icon="el-icon-plus" type="primary" @click="addTimer">新增定时器</el-button>
    </div>
    <el-divider/>
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
      />
      <el-table-column
        v-for="(item,index) in headTitArrNew"
        :key="index"
        show-overflow-tooltip
        sortable
        :min-width="GLOBAL.minCellWidth"
        :width="item.fieldKey === 'prevFireTime' || item.fieldKey === 'nextFirlTime'?'146px':''"
        :prop="item.fieldKey"
        :label="item.fieldName"
      >
        <template v-if="item.fieldKey === 'timer'" scope="scope">
          <span v-if="timerSeting(scope.row.timer).type === '1'">在{{ timerSeting(scope.row.timer).timerCode }}执行一次</span>
          <span v-else-if="timerSeting(scope.row.timer).type === '2'">每年{{ timerSeting(scope.row.timer).timerCode }}执行一次</span>
          <span v-else-if="timerSeting(scope.row.timer).type === '3'">每月{{ timerSeting(scope.row.timer).timerCode }}执行一次</span>
          <span v-else-if="timerSeting(scope.row.timer).type === '4'">每日{{ timerSeting(scope.row.timer).timerCode }}执行一次</span>
          <span v-else-if="timerSeting(scope.row.timer).type === '5'">每时{{ timerSeting(scope.row.timer).timerCode }}执行一次</span>
          <span v-else-if="timerSeting(scope.row.timer).type === '6'">每隔{{ timerSeting(scope.row.timer).timerCode }}分钟执行一次</span>
          <span v-else-if="timerSeting(scope.row.timer).type === '7'">每隔{{ timerSeting(scope.row.timer).timerCode }}秒执行一次</span>
        </template>
        <template v-else-if="item.fieldKey == 'status'" scope="scopeStatus">
          <span v-if="scopeStatus.row.status === 0">未上线</span>
          <span v-if="scopeStatus.row.status === 1">已上线</span>
        </template>
        <template v-else-if="item.fieldKey == 'type'" scope="scopeType">
          <span v-if="scopeType.row.type === 1">远程任务</span>
        </template>
        <template v-else-if="item.fieldKey == 'content'" scope="scopeContent">
          <span v-if="scopeContent.row.content&&isJson(scopeContent.row.content)">{{ JSON.parse(scopeContent.row.content).url }}</span>
          <span v-else>{{ scopeContent.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="128"
      >
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.status === 0 && btnRole.indexOf(GLOBAL.btnRole.EditBtn) != -1" class="item" effect="dark" content="编辑" placement="top">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              class="editBtnOnly"
              circle
              @click="editMenuItem(scope.row,scope.$index)"
            />
          </el-tooltip>
          <el-tooltip v-if="scope.row.status === 0 && btnRole.indexOf(GLOBAL.btnRole.PubBtn) != -1" class="item" effect="dark" content="发布" placement="top">
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-s-promotion"
              class="authBtnOnly"
              circle
              @click="issueTimerItem(scope.row,scope.$index,1)"
            />
          </el-tooltip>
          <el-tooltip v-if="scope.row.status === 0 && btnRole.indexOf(GLOBAL.btnRole.AddBtn) != -1" class="item" effect="dark" content="删除" placement="top">
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              class="delBtnOnly"
              circle
              @click="delMenuItem(scope.row,scope.$index)"
            />
          </el-tooltip>
          <el-tooltip v-if="scope.row.status === 1 && btnRole.indexOf(GLOBAL.btnRole.OffBtn) != -1" class="item" effect="dark" content="下线" placement="top">
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-minus"
              class="delBtnOnly"
              circle
              @click="issueTimerItem(scope.row,scope.$index,0)"
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
    this.requestUrl = this.Api.queryTasks
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
      if (!data.menuId) {
        _this.$nextTick(() => {
          if (!data.id) {
            _this.$nextTick(() => {
              _this.$refs.child.resetSearch(_this.dynamicParam, _this.pageNum)
            })
          } else {
            _this.$set(_this.tableData, _this.editIndex, data)
          }
        })
      } else {
        _this.$set(_this.tableData, _this.editIndex, data)
      }
    })
  },
  methods: {
    isJson(str) {
      if (typeof str === 'string') {
        try {
          const obj = JSON.parse(str)
          if (typeof obj === 'object' && obj) {
            return true
          }
          return false
        } catch (e) {
          return false
        }
      }
    },
    timerSeting(timer) {
      const array = timer.split(' ')
      let datetimeStr = ''
      let type = -1
      if (array[5] !== '?') {
        datetimeStr = `${array[5]}-`
        type = '1'
      }
      if (array[4] !== '*') {
        datetimeStr = `${datetimeStr}${array[4]}-`
        if (type === -1) {
          type = '2'
        }
      }
      if (array[3] !== '*') {
        datetimeStr = `${datetimeStr}${array[3]} `
        if (type === -1) {
          type = '3'
        }
      }
      if (array[2] !== '*') {
        datetimeStr = `${datetimeStr}${array[2]}:`
        if (type === -1) {
          type = '4'
        }
      }
      if (array[1] !== '*') {
        if (type === -1 && array[0] === '0') {
          const value = array[1]
          if (value.indexOf('/') > -1) {
            const a = value.split('/')
            datetimeStr = a[1]
            type = '6'
            return { type, timerCode: datetimeStr }
          }
        }
        datetimeStr = `${datetimeStr}${array[1]}:`
        if (type === -1) {
          type = '5'
        }
      }
      if (array[0] !== '*') {
        if (type === -1) {
          const last = array[0]
          if (last.indexOf('/') > -1) {
            const aa = last.split('/')
            datetimeStr = aa[1]
            type = '7'
            return { type, timerCode: datetimeStr }
          }
        }
        datetimeStr = `${datetimeStr}${array[0]}`
        if (type === -1) {
          type = '6'
        }
      }
      return { type, timerCode: datetimeStr }
    },
    issueTimerItem(item, index, type) {
      let msg = ''
      let ApiUrl = ''
      let newState = ''
      if (type === 1) {
        msg = '确认发布该定时器'
        ApiUrl = this.Api.resumeJob
        newState = 1
      } else if (type === 0) {
        msg = '确认下线该定时器'
        ApiUrl = this.Api.pauseJob
        newState = 0
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const _this = this
        const con = {
          taskName: item.taskName,
          taskGroup: item.taskGroup,
        }
        const jsonParam = _this.GLOBAL.paramJson(con)
        _this.$axios.post(ApiUrl, jsonParam).then((res) => {
          if (res.data.head.status === 0) {
            _this.tableData[index].status = newState
            _this.$message({
              type: 'success',
              message: '修改成功!',
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
    editMenuItem(item, index) {
      this.editIndex = index
      this.$router.push({
        path: '/timer/addtimer',
        query: {
          item,
        },
      })
    },
    delMenuItem(item, index) {
      this.$confirm('确认删除该定时器?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const _this = this
        const con = {
          id: item.id,
          name: item.name,
          code: item.code,
        }
        const jsonParam = _this.GLOBAL.paramJson(con)
        _this.$axios.post(_this.Api.delJob, jsonParam).then((res) => {
          if (res.data.head.status === 0) {
            _this.tableData.splice(index, 1)
            if (_this.total > 0) {
              _this.total -= 1
            }
            if (_this.tableData.length === 0 && _this.total > 0) {
              _this.pageNum -= 1
              _this.dynamicParam.forEach(el => {
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
    addTimer() {
      this.$router.push({
        path: '/timer/addTimer',
      })
    },
    indexMethod(index) {
      return (index + 1) + ((this.pageNum - 1) * this.pageSize)
    },
  },
}
</script>
