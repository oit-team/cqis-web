<template>
  <div id="taskList" class="pageCommonStyle">
    <vc-search/>
    <div class="operateBtn">
      <el-button size="small" icon="el-icon-plus" class="addBtnOnly" type="primary">新增用户</el-button>
    </div>
    <el-divider/>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="date"
        label="日期"
        width="150"
      />
      <el-table-column
        prop="name"
        label="姓名"
        width="120"
      />
      <el-table-column
        prop="province"
        label="省份"
        width="120"
      />
      <el-table-column
        prop="city"
        label="市区"
        width="120"
      />
      <el-table-column
        prop="address"
        label="权限"
        width="120"
      />
      <el-table-column
        prop="time"
        label="账号有效期"
        width="120"
      />
      <el-table-column
        prop="zip"
        label="邮编"
        width="120"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="1"
      :page-sizes="[10, 20, 30]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="1000"
    />
  </div>
</template>

<script>
import VcSearch from './CommonSearch'

export default {
  name: 'TablePage',
  components: {
    VcSearch,
  },
  props: {
    msg: String,
  },
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        province: '广东',
        city: '广州',
        address: '管理员',
        zip: '20xxxxx',
        time: '2020-02-31',
      }],
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  padding: 0;
  list-style-type: none;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
