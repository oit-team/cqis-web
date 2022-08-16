import Vue from 'vue'
import axios from 'axios'
import VueRouter from 'vue-router'
import md5 from 'md5'
import elCascaderMulti from 'el-cascader-multi'
import VideoPlay from 'mycom'
import App from './App'
import router from './router'
import store from './store'
import globalFun from './assets/js/globalFun'
import Api from './assets/js/Api'
// ================js================
import './plugins'

// ================styles================
import './styles/index.scss'
import './styles/common.css'
import './assets/icon/iconfont.css'
import 'mycom/dist/mycom.css'
import 'windi.css'

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.GLOBAL = globalFun
Vue.prototype.Api = Api
Vue.prototype.md5 = md5
Vue.prototype.$bus = new Vue()
Vue.use(elCascaderMulti)
Vue.use(VideoPlay)
const [routerPush, routerReplace] = [VueRouter.prototype.push, VueRouter.prototype.replace]
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}
VueRouter.prototype.replace = function replace(location) {
  return routerReplace.call(this, location).catch(error => error)
}
// 全局获取缓存数据
Vue.prototype.resetSetItem = (key, newVal) => {
  if (key === 'menuList') {
    const newStorageEvent = document.createEvent('StorageEvent')
    const storage = {
      setItem: (k, val) => {
        sessionStorage.setItem(k, val)
        newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null)
        window.dispatchEvent(newStorageEvent)
      },
    }
    return storage.setItem(key, newVal)
  }
  return ''
}
// 注册全局钩子用来拦截导航
router.beforeEach((to, from, next) => {
  document.title = '客服录屏质检管理系统'
  if (to.meta.requiresAuth) {
    if (sessionStorage.aid) {
      if (to.path !== '/' && to.path !== '/index') {
        const toPath = to.path.split('/')[1]
        if (sessionStorage.homeMenuPathArr.includes(toPath)) {
          next()
        } else {
          Vue.prototype.$message({
            message: '暂无访问权限',
            type: 'warning',
            duration: '3000',
          })
        }
      } else {
        next()
      }
    } else {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath,
        },
      })
    }
  } else {
    next()
  }
})
// 请求拦截器
axios.interceptors.request.use(
  config => {
    if (!config.headers.aid) {
      config.headers.aid = sessionStorage.aid
    }
    if (!config.headers.token) {
      config.headers.token = sessionStorage.accessToken
    }
    return config
  },
  error => {
    return Promise.reject(error)
  },
)
axios.interceptors.response.use((response) => {
  return response
}, (error) => {
  if (!error.response) {
    return Promise.reject(error)
  }
  switch (error.response.status) {
    case 401:
      if (error.response.data && error.response.data.code === '3001') {
        Vue.prototype.$message({
          message: '版本/*  */升级，请重新登录',
          type: 'warning',
        })
        sessionStorage.clear()
        localStorage.clear()
        router.replace({
          path: '/login',
        })/*  */
      } else {
        Vue.prototype.$message({
          message: '发现未认证的请求，拒绝访问',
          type: 'warning',
        })
      }
      sessionStorage.clear()
      localStorage.clear()
      router.replace({
        path: '/login',
      })
      return Promise.reject(error)
    case 403:
      Vue.prototype.$message({
        message: '会话超时，已注销，请重新登录',
        type: 'warning',
      })
      sessionStorage.clear()
      localStorage.clear()
      router.replace({
        path: '/login',
      })
      return Promise.reject(error)
    case 400:
      break
    case 404:
      break
    case 500:
      break
    default:
      return Promise.reject(error)
  }
  return error
})
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
