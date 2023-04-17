<template>
  <el-header>
    <div class="system">
      <div class="logoBox"></div>
    </div>
    <div class="navBox">
      <i
        class="collapse-btn"
        :class="$store.state.aside.collapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
        @click="$store.commit('aside/switchCollapse')"
      ></i>
      <el-menu
        class="scrollbar"
        :default-active="activeIndex"
        mode="horizontal"
      >
        <el-menu-item
          v-for="(item, index) in menuList"
          :key="index"
          :index="`${item.menuId}`"
          @click="pageTo(item)"
        >
          {{ item.menuName }}
        </el-menu-item>
      </el-menu>
      <div class="account">
        <el-dropdown>
          <span class="account-name">
            {{ userName }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item class="dropdown-item--primary" @click.native="ChangePwd">
              修改密码
            </el-dropdown-item> -->
            <el-dropdown-item class="dropdown-item--primary" @click.native="logout">
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="ChangePwd">
      <el-drawer
        title="修改密码"
        :append-to-body="true"
        :modal-append-to-body="true"
        :visible.sync="drawer"
        :direction="direction"
      >
        <el-form ref="ruleForm" style="width:80%;margin: 0 auto" :model="ruleForm" :rules="rules">
          <el-form-item prop="userName">
            <el-input
              v-model.trim="ruleForm.userName"
              clearable
              placeholder="请输入工号"
            />
          </el-form-item>
          <el-form-item prop="passWord">
            <el-input
              v-model.trim="ruleForm.passWord"
              type="password"
              clearable
              placeholder="请输入密码"
              @keyup.enter.native="ChangePwd('ruleForm')"
            />
          </el-form-item>
        </el-form>
        <div style="width: 80%;margin:0 auto;">
          <el-button style="width:100%" type="primary" @click="ChangePwd('ruleForm')">
            修改密码
          </el-button>
        </div>
      </el-drawer>
    </div>
  </el-header>
</template>

<script>
export default {
  name: 'VcHeader',
  props: {
    menuList: Array,
  },
  data() {
    return {
      activeIndex: '',
      ruleForm: {
        userName: '',
        passWord: '',
      },
      userName: '',
      type: '',
      direction: 'rtl',
      drawer: false,
      rules: {
        userName: [
          {
            required: true,
            message: '请输入工号',
          },
        ],
        passWord: [
          {
            required: true,
            message: '请输入密码',
          },
        ],
      },
    }
  },
  watch: {
    menuList(newData) {
      const MenuStatus = {}
      newData.forEach((item, i) => {
        MenuStatus[item.menuCode] = ''
      })
      sessionStorage.MenuStatus = JSON.stringify(MenuStatus)
      this.pageTo(newData[0])
      this.activeIndex = `${newData[0].menuId}`
    },
  },
  created() {
    this.userName = sessionStorage.userName
    this.type = sessionStorage.accountType // 0是正式用户， 1是临时用户
  },
  methods: {
    logout() {
      // window.open('', 'sign-out', 'popup')
      const con = {
        aid: sessionStorage.aid,
        token: sessionStorage.accessToken,
        mod: sessionStorage.mod,
        accountType: sessionStorage.accountType,
        employeeNum: sessionStorage.employeeNum,
        name: sessionStorage.userName,

      }
      const _this = this
      const jsonParam = _this.GLOBAL.paramJson(con)
      _this.$axios.post(_this.Api.logout, jsonParam).then((res) => {
        if (res.data.head.status === 0) {
          this.cdaLogout()
          _this.$message({
            message: res.data.head.msg,
            type: 'success',
          })
        }
        setTimeout(() => {
          sessionStorage.clear()
          _this.$router.push({
            path: '/login',
          })
        }, 1000)
      })
    },
    cdaLogout() {
      const iframe = document.createElement('iframe')
      const origin = new URL(sessionStorage.cdaLoginUrl).origin

      iframe.style.display = 'none'
      iframe.src = `${origin}/console/sign-out-cda.html`
      iframe.onload = iframe.remove

      document.body.appendChild(iframe)
    },
    ChangePwd() {
      window.location.href = 'https://ids.csair.com/ids/custom/ChangePassword.jsp'
    },
    pageTo(val) {
      if (this.activeIndex === val.menuId && val.menuType === 0) {
        return
      } if (val.menuType === 0) {
        this.activeIndex = val.menuId
      }
      if (val.menuType === 0) {
        this.$bus.$emit('childrenMenu', { childrenMenu: val.childrenMenu, parentCode: val.menuCode })
        if (val.fieldDes) {
          sessionStorage.headTitString = val.fieldDes
        }
        this.$router.push({
          path: val.menuUrl,
        })
      } else if (val.menuType === 1) {
        window.open(`${val.menuUrl}?data=${sessionStorage.cdaMsg}&t=${Date.now()}`)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "src/styles/element-variables";

.el-menu-item:not(.is-disabled):hover{
  border-bottom: 2px solid #fff!important;
  color:#fff!important;
  background:#008acd!important;
}
.el-menu-item:not(.is-disabled):focus{
  border-bottom: 2px solid #fff!important;
  color:#fff!important;
  background:#008acd!important;
}
.is-active{
  border-bottom:2px solid #fff!important;
}
.el-header {
  z-index: 1;
  display: flex;
  align-items: center;
  border-bottom: solid 1px #e6e6e6;
  // border-bottom: solid 1px #008acd;
  padding:0 0 0 20px;
  // background:#008acd;
}
.navBox{
  background: #008acd;
  width: 100%;
  padding-right: 20px;
  >i{
    float: left;
  }
  >.scrollbar{
    float: left;
    border-bottom:1px solid #008acd;
    background: #008acd;
    width: calc(100% - 178px);
    overflow-y: auto;
    display: flex;
    height:60px;
    overflow:hidden;
    .el-menu-item{
      color:#fff;
      height:53px;
    }
    .is-active{
      color:#fff;
    }
  }
  >.account{
    float: right;
    height: 60px;
    line-height: 60px;
  }
}
.system {
  display: flex;
  align-items: center;
  padding-right:0px;
  user-select: none;
  .system-name {
    font-weight: bold;
    line-height: 0;
    padding-left: 12px;
  }
}

.collapse-btn {
  font-size: 24px;
  padding:0 14px;
  cursor: pointer;
  line-height: 60px;
  color:#fff;
}

.account {
  margin-left: auto;

  .account-name {
    cursor: pointer;
    color:#fff;
  }
}

.dropdown-item--primary {
  color: $--color-primary;

  &:focus, &:not(.is-disabled):hover {
    color: $--color-primary;
    background-color: transparentize($--color-primary, 0.9);
  }
}
.logoBox{
  width: 220px;
  height:40px;
  background:url('~@/assets/images/headfoot.png') 0 0 no-repeat ;
}
</style>
