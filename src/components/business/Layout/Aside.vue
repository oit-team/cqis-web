<template>
  <el-aside width="auto">
    <el-menu
      class="overflow-auto scrollbar"
      :collapse="$store.state.aside.collapse"
      :default-active="defalutActive"
      @select="selectMenu"
    >
      <template v-for="item in menuList">
        <el-submenu v-if="item.childrenMenu && item.childrenMenu.length > 0" :key="item.menuId" :index="item.menuId">
          <template slot="title">
            <i :class="[item.menuImg]"></i>
            <span slot="title">{{ item.menuName }}</span>
          </template>
          <template v-for="(val, i) in item.childrenMenu">
            <el-submenu v-if="val.childrenMenu && item.childrenMenu.length > 0" :key="i" :index="val.menuId">
              <template slot="title">
                <span slot="title">{{ val.menuName }}</span>
              </template>
              <el-menu-item
                v-for="(value, index) in val.childrenMenu"
                :key="index"
                class="menu-item"
                :index="value.menuId"
                @click="clickSubMenu(value)"
              >
                <i :class="[value.menuImg]"></i>
                <span slot="title">{{ value.menuName }}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item
              v-else
              :key="i"
              class="menu-item"
              :index="val.menuId"
              @click="clickSubMenu(val)"
            >
              <i :class="[val.menuImg]"></i>
              <span slot="title">{{ val.menuName }}</span>
            </el-menu-item>
          </template>
        </el-submenu>
        <el-menu-item
          v-else
          :key="item.menuId"
          :index="item.menuId"
          class="otherMenuItem"
          @click="clickSubMenu(item)"
        >
          <i :class="[item.menuImg]" style="font-size:18px;"></i>
          <span slot="title">{{ item.menuName }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  name: 'VcAside',
  data() {
    return {
      menuList: [],
      defalutActive: '',
      parentCode: '',
    }
  },
  watch: {
    menuList(newData) {
      const _this = this
      const MenuStatus = JSON.parse(sessionStorage.MenuStatus)
      if (MenuStatus[this.parentCode]) {
        this.defalutActive = MenuStatus[this.parentCode]
        const data = this.setSeesionActive(this.menuList, MenuStatus[this.parentCode])
        _this.clickSubMenu(data)
      } else {
        for (const i in newData) {
          if (newData[i].menuType === 0) {
            _this.setActivePage(newData[i], i)
            return
          }
        }
      }
    },
  },
  created() {
    const _this = this
    this.$bus.$off('childrenMenu')
    this.$bus.$on('childrenMenu', (data) => {
      _this.menuList = data.childrenMenu
      _this.parentCode = data.parentCode
    })
  },
  methods: {
    setSeesionActive(data, menuId) {
      const _this = this
      for (const i in data) {
        if (data[i].menuId === menuId) {
          return data[i]
        } if (data[i].childrenMenu !== null && data[i].childrenMenu.length > 0) {
          _this.setSeesionActive(data[i].childrenMenu, menuId)
        }
      }
    },
    setActivePage(data, index) {
      const _this = this
      if (data.childrenMenu === null) {
        _this.defalutActive = data.menuId
        _this.clickSubMenu(data)
      } else {
        for (const i in data.childrenMenu) {
          if (data.childrenMenu[i].childrenMenu === null) {
            _this.defalutActive = data.childrenMenu[i].menuId
            _this.clickSubMenu(data.childrenMenu[i])
          } else if (data.childrenMenu[i].childrenMenu !== null) {
            _this.setActivePage(data.childrenMenu[i].childrenMenu)
          }
        }
      }
    },
    selectMenu(...index) {
      this.$store.commit('aside/selectMenu', index)
    },
    clickSubMenu(val) {
      if (val.menuType === 1) {
        window.open(val.menuUrl)
      } else {
        if (val.fieldDes) {
          sessionStorage.headTitString = val.fieldDes
        }
        this.defalutActive = val.menuId
        const MenuStatus = JSON.parse(sessionStorage.MenuStatus)
        MenuStatus[this.parentCode] = val.menuId
        sessionStorage.MenuStatus = JSON.stringify(MenuStatus)
        this.$router.push({
          path: val.menuUrl,
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.el-aside {
  position: relative;
}

.el-menu {
  height: 100%;

  &:not(.el-menu--collapse) {
    width: 240px;
  }
}
</style>
