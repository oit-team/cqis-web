import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/components/business/Layout/'

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    component: Layout,
    meta: {
      keepAliveA: false,
      requiresAuth: true,
    },
    children: [
      {
        path: '/',
        name: 'Home',
        meta: {
          title: '首页',
          keepAliveA: true,
          requiresAuth: true,
        },
        component: () => import('@/views/Home'),
      },
      {
        path: 'Role/RoleList',
        name: 'RoleList',
        meta: {
          title: '角色列表',
          keepAliveA: true,
          requiresAuth: true,
        },
        component: () => import('@/views/Role/RoleList'),
      },
      {
        path: 'Role/addRole',
        name: 'addRole',
        meta: {
          title: '新增角色',
          keepAliveA: false,
          requiresAuth: true,
        },
        component: () => import('@/views/Role/addRole'),
      },
      {
        path: 'Role/authUsersByRoleId',
        name: 'authUsersByRoleId',
        meta: {
          title: '角色授权',
          keepAliveA: false,
          requiresAuth: true,
        },
        component: () => import('@/views/Role/authUsersByRoleId'),
      },
      {
        path: 'Menu/MenuList',
        name: 'MenuList',
        meta: {
          title: '菜单列表',
          keepAliveA: true,
          requiresAuth: true,
        },
        component: () => import('@/views/Menu/MenuList'),
      },
      {
        path: 'Menu/AddMenu',
        name: 'AddMenu',
        meta: {
          title: '新增菜单',
          keepAliveA: false,
          requiresAuth: true,
        },
        component: () => import('@/views/Menu/AddMenu'),
      },
      {
        path: 'User/UserList',
        name: 'UserList',
        meta: {
          title: '用户列表',
          keepAliveA: true,
          requiresAuth: true,
        },
        component: () => import('@/views/User/UserList'),
      },
      {
        path: 'User/AddUser',
        name: 'AddUser',
        meta: {
          title: '新增用户',
          keepAliveA: false,
          requiresAuth: true,
        },
        component: () => import('@/views/User/AddUser'),
      },
      {
        path: 'timer/timerlist',
        name: 'timerlist',
        meta: {
          title: '计时器列表',
          keepAliveA: true,
          requiresAuth: true,
        },
        component: () => import('@/views/Timer/TimerList'),
      },
      {
        path: 'timer/addtimer',
        name: 'addtimer',
        meta: {
          title: '新增计时器',
          keepAliveA: false,
          requiresAuth: true,
        },
        component: () => import('@/views/Timer/AddTimer'),
      },
      {
        path: 'customer/customerlist',
        name: 'customerlist',
        meta: {
          title: '坐席列表',
          keepAliveA: true,
          requiresAuth: true,
        },
        component: () => import('@/views/Customer/CustomerList'),
      },
      {
        path: 'customer/addcustomer',
        name: 'addcustomer',
        meta: {
          title: '新增坐席',
          keepAliveA: false,
          requiresAuth: true,
        },
        component: () => import('@/views/Customer/AddCustomer'),
      },
      {
        path: 'datarole/datarolelist',
        name: 'datarolelist',
        meta: {
          title: '数据角色列表',
          keepAliveA: true,
          requiresAuth: true,
        },
        component: () => import('@/views/DataRole/DataRoleList'),
      },
      {
        path: 'datarole/adddatarole',
        name: 'adddatarole',
        meta: {
          title: '新增数据角色',
          keepAliveA: false,
          requiresAuth: true,
        },
        component: () => import('@/views/DataRole/AddDataRole'),
      },
      {
        path: 'department/departmentlist',
        name: 'departmentlist',
        meta: {
          title: '部门列表',
          keepAliveA: true,
          requiresAuth: true,
        },
        component: () => import('@/views/Department/DepartmentList'),
      },
      {
        path: 'department/adddepartment',
        name: 'adddepartment',
        meta: {
          title: '新增部门',
          keepAliveA: false,
          requiresAuth: true,
        },
        component: () => import('@/views/Department/AddDepartment'),
      },
      {
        path: 'department/authcustomerbydept',
        name: 'authcustomerbydept',
        meta: {
          title: '授权坐席',
          keepAliveA: false,
          requiresAuth: true,
        },
        component: () => import('@/views/Department/authCustomerByDept'),
      },
      {
        path: 'order/orderlist',
        name: 'OrderList',
        meta: {
          title: '工单列表',
          keepAliveA: true,
          requiresAuth: true,
        },
        component: () => import('@/views/Order/OrderList'),
      },
      {
        path: 'order/info',
        name: 'OrderInfo',
        meta: {
          title: '工单列表',
          keepAliveA: true,
          requiresAuth: true,
        },
        component: () => import('@/views/Order/Info'),
      },
      {
        path: 'log/loglist',
        name: 'LogList',
        meta: {
          title: '日志列表',
          keepAliveA: true,
          requiresAuth: true,
        },
        component: () => import('@/views/Log/LogList'),
      },
      {
        path: 'Interfacelog/loglist',
        name: 'Interfacelog',
        meta: {
          title: '行为日志',
          keepAliveA: true,
          requiresAuth: true,
        },
        component: () => import('@/views/InterfaceLog/LogList'),
      },
      {
        path: 'Interfacelog/loginfo',
        name: 'Interfacelog',
        meta: {
          title: '日志详情',
          keepAliveA: false,
          requiresAuth: true,
        },
        component: () => import('@/views/InterfaceLog/LogInfo'),
      },
    ],
  },
  {
    path: '/Login',
    name: 'Login',
    meta: {
      title: '登录',
      keepAliveA: false,
      requiresAuth: false,
    },
    component: () => import('@/views/Login'),
  },
  {
    path: '/About',
    name: 'About',
    meta: {
      title: 'About',
      keepAliveA: false,
      requiresAuth: false,
    },
    component: () => import('@/views/About'),
  },
]
const router = new VueRouter({
  routes,
})

export default router
