<template>
  <div id="login">
    <div class="login_head">
      <div class="content">
        <div class="LoginBox">
          <div class="head_img">
            <img src="../assets/images/LOGO.png"/>
          </div>
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
            <el-form-item prop="employeeNum">
              <el-input
                v-model.trim="ruleForm.employeeNum"
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
                @keyup.enter.native="login('ruleForm')"
              />
            </el-form-item>
            <el-form-item prop="tryCode">
              <el-input
                v-model.trim="ruleForm.tryCode"
                type="test"
                clearable
                style="width:118px;"
                placeholder="验证码"
                @keyup.enter.native="login('ruleForm')"
              />
              <img class="checkCodeImg" :src="checkCodeUrl" alt="" @click="loadCheckCodeUrl"/>
            </el-form-item>
            <el-form-item v-if="isShowPhoneCode" prop="PhoneCode">
              <el-input
                v-model.trim="ruleForm.PhoneCode"
                type="test"
                clearable
                style="width:138px;"
                placeholder="手机验证码"
                @keyup.enter.native="login('ruleForm')"
              />
              <el-button style="float: right;" :disabled="PhoneBtnMsg !== '获取验证码'" type="primary" @click="getPhoneCode()">{{ PhoneBtnMsg }}</el-button>
            </el-form-item>
          </el-form>
          <div class="loginBtn">
            <el-button class="btn_submit" type="primary" @click="login('ruleForm')">登录</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VcAudio from '../components/basic/VueAudio'

export default {
  name: 'Login',
  components: {
    VcAudio,
  },
  props: {},
  data() {
    return {
      sm2PublicKey: '',
      chcode: '',
      validateKey: '',
      checkCodeUrl: '',
      token: '',
      mobile: '',
      PhoneBtnMsg: '获取验证码',
      isShowPhoneCode: false,
      checkList: [],
      ruleForm: {
        ipAddr: '',
        employeeNum: '',
        passWord: '',
        PhoneCode: '',
        tryCode: '',
      },
      rules: {
        employeeNum: [
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
        passWord: [
          {
            required: true,
            message: '请输入密码',
          },
        ],
        PhoneCode: [
          {
            required: true,
            message: '请输入手机验证码',
          },
        ],
        tryCode: [
          {
            required: true,
            message: '请输入验证码',
          },
        ],
      },
    }
  },
  watch: {},
  created() {
    this.getLocalHost()
    Object.keys(this.ruleForm).map(key => {
      return false
    })
  },
  mounted() {
    // this.loadCheckCodeUrl()
    this.getKey()
  },
  activated() {},
  methods: {
    getKey() {
      const _this = this
      const con = {
      }
      const jsonParam = _this.GLOBAL.paramJson(con)
      _this.$axios.post(_this.Api.getKey, jsonParam).then((res) => {
        if (res.data.head.status === 0) {
          _this.sm2PublicKey = res.data.body.sm2PublicKey
          _this.chcode = res.data.body.token
          _this.loadCheckCodeUrl()
        } else {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    loadCheckCodeUrl() {
      this.ruleForm.tryCode = ''
      const a = Date.now()
      this.checkCodeUrl = `${this.Api.verifyCode}?validateKey=${this.chcode}&token=${a}`
    },
    getPhoneCode() {
      const _this = this
      let Second = 60
      _this.PhoneBtnMsg = `(${Second}s)`
      const CodeNum = setInterval(() => {
        Second--
        _this.PhoneBtnMsg = `(${Second}s)`
        if (Second < 0) {
          _this.PhoneBtnMsg = '获取验证码'
          clearInterval(CodeNum)
        }
      }, 1000)
      const con = {
        employeeNum: _this.ruleForm.employeeNum,
        ip: _this.ruleForm.ipAddr,
        token: _this.token,
        mobile: _this.mobile,
      }
      _this.loadCheckCodeUrl()
      const jsonParam = _this.GLOBAL.paramJson(con)
      _this.$axios.post(_this.Api.getPhoneCode, jsonParam).then((res) => {
        if (res.data.head.status !== 0) {
          _this.$message({
            message: res.data.head.msg,
            type: 'warning',
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    login(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          const { sm2 } = require('sm-crypto')
          const publicKey = _this.sm2PublicKey
          const enPassword = sm2.doEncrypt(_this.ruleForm.passWord, publicKey, 1)
          const con = {
            employeeNum: _this.ruleForm.employeeNum,
            // password: _this.ruleForm.passWord,
            password: `04${enPassword}`,
            ip: _this.ruleForm.ipAddr,
            mobileCode: _this.ruleForm.PhoneCode,
            token: _this.token,
            verificationCode: _this.ruleForm.tryCode,
            validateKey: _this.chcode,
          }
          const jsonParam = _this.GLOBAL.paramJson(con)
          jsonParam.head.chcode = this.chcode
          _this.$axios.post(_this.Api.login, jsonParam).then((res) => {
            if (res.data.head.status === 0) {
              sessionStorage.chcode = this.chcode
              sessionStorage.accessToken = res.data.body.token
              sessionStorage.aid = res.data.body.aid
              sessionStorage.de = res.data.body.de
              sessionStorage.mod = res.data.body.mod
              sessionStorage.userName = res.data.body.name
              sessionStorage.accountType = res.data.body.accountType
              sessionStorage.employeeNum = res.data.body.employeeNum
              sessionStorage.cdaMsg = res.data.body.cdaMsg
              _this.$router.push({
                path: '/',
              })
            } else if (res.data.head.status === 3 || res.data.head.status === 4) {
              _this.$alert(`${res.data.head.msg} <a style='text-decoration: none;'  target='_blank' href='https://ids.csair.com/ids/custom/ChangePassword.jsp'>请点击此处修改密码</a>`, {
                title: '提示',
                showConfirmButton: false,
                dangerouslyUseHTMLString: true,
              })
              _this.loadCheckCodeUrl()
            } else if (res.data.head.status === 63 || res.data.head.status === 64) {
              _this.isShowPhoneCode = true
              _this.$message({
                message: res.data.head.msg,
                type: 'warning',
              })
              _this.token = res.data.body.token
              _this.mobile = res.data.body.mobile
              _this.loadCheckCodeUrl()
            } else {
              _this.$message({
                message: res.data.head.msg,
                type: 'warning',
              })
              _this.loadCheckCodeUrl()
            }
          })
        }
      })
    },
    getLocalHost() {
      const _this = this
      const RTCP = window.RTCPeerConnection || window.webkitRTCPeerConnection
      if (RTCP) {
        const rtc = new RTCP()
        rtc.createDataChannel('')
        rtc.createOffer(offerDesc => {
          rtc.setLocalDescription(offerDesc)
        }, e => {
        })
        rtc.onicecandidate = (evt) => {
          if (evt.candidate) {
            const ipRule = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
            const isIp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
            const ipAddr = ipRule.exec(evt.candidate.candidate)
            if (isIp.test(ipAddr[0])) {
              _this.ruleForm.ipAddr = ipAddr[0]
            }
          }
        }
      }
    },
  },
}
</script>
<style lang="scss" scoped>
  .content{
    position: absolute;
    width: 100%;
    height: 100%;
    background:url(../assets/images/loginbg.jpg) no-repeat center center;
    background-size: cover;
  }
  .LoginBox{
    width: 300px;
    position:absolute;
    left:50%;
    top:50%;
    margin-left:120px;
    margin-top:-180px;
    padding:46px 20px;
    background: #fff;
    border:1px solid #efefef;
    border-radius: 6px;
  }
  .head_img img{
    display: block;
    margin:0 auto 20px;
  }
  .btn_submit{
    width: 100%;
  }
  .checkCodeImg{
    width:130px;
    float: right;
    height: 40px;
    cursor:pointer;
  }
</style>
