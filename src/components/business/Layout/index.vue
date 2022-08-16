<template>
  <el-container class="page-container" direction="vertical">
    <vc-header :menu-list="menuList" :active-index="activeIndex"/>
    <el-container class="overflow-hidden">
      <vc-aside ref="elaside"/>
      <vc-main ref="elmain" class="scrollbar test"/>
    </el-container>
  </el-container>
</template>

<script>
import VcHeader from './Header'
import VcAside from './Aside'
import VcMain from './Main'

export default {
  name: 'VcLayout',
  components: {
    VcMain,
    VcAside,
    VcHeader,
  },
  data() {
    return {
      menuList: [],
      activeIndex: '',
      pathArr: [],
      pageBtnRole: [],
    }
  },
  created() {
    this.getTreeMenuList()
  },
  mounted() {
    const _this = this
  },
  methods: {
    getTreeMenuList() {
      const con = {
        isShowMenu: 'yes',
      }
      const jsonParam = this.GLOBAL.paramJson(con)
      const _this = this
      this.$axios.post(_this.Api.getTreeMenuList, jsonParam).then((res) => {
        if (res.data.head.status === 0) {
          if (res.data.body.resultMap) {
            this.menuList = res.data.body.resultMap
            this.addPathArr(this.menuList)
            sessionStorage.homeMenuPathArr = this.pathArr
            this.$store.commit('setPageBtnRole', this.pageBtnRole)
          } else {
            _this.$message({
              message: '该用户暂未被授予角色权限',
              type: 'warning',
            })
          }
        }
      })
    },
    // 本地存储菜单路径，用户判断用户是否有权限进入
    // 存储各个页面按钮权限
    addPathArr(val) {
      const _this = this
      val.forEach((item, i) => {
        if (item.childrenMenu && item.childrenMenu.length > 0) {
          _this.addPathArr(item.childrenMenu)
        } else if (item.menuType === 0 && item.btnList !== null && item.btnList.length > 0) {
          const btnList = []
          item.btnList.forEach((Item, index) => {
            btnList.push(Item.menuName)
          })
          _this.pageBtnRole.push({ menuUrl: item.menuUrl, btnList })
          _this.pathArr.push(item.menuUrl.split('/')[1])
        } else if (item.menuType === 0) {
          _this.pathArr.push(item.menuUrl.split('/')[1])
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.page-container {
  overflow: hidden;
  width: 100vw;
  height: 100vh;
}
</style>
