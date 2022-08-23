const baseURL = process.env.VUE_APP_BASE_URL
const system = `${baseURL}/user-server`
const timer = `${baseURL}/task-server`
const work = `${baseURL}/work-server`
const verifyCode = `${system}/user/verifyCode`
const userTemplate = `${system}/uploadExcel/download`
const getAllMenuList = `${system}/menu/getAllMenuList`
const getTreeMenuList = `${system}/menu/getTreeMenuList`
const getAllMenuAndTree = `${system}/menu/getAllMenuAndTree`
const getRoleMenuList = `${system}/role/getRoleMenuList`
const delMenuById = `${system}/menu/delMenuById`
const insertMenu = `${system}/menu/insertMenu`
const updateMenuById = `${system}/menu/updateMenuById`
const addMenuButton = `${system}/menu/addMenuButton`// 添加菜单按钮权限
const login = `${system}/user/login`
const logout = `${system}/user/loginOut`
const getPhoneCode = `${system}/user/getPhoneCode`// 获取手机验证码
const getAllUsers = `${system}/user/getAllUsers`
const insertUser = `${system}/user/insertUser`
const delUserById = `${system}/user/delUserById`
const updateUserById = `${system}/user/updateUserById`
const verifyUserName = `${system}/user/verifyUserName`
const addUserAndRole = `${system}/user/addUserAndRole`
const importDataInfo = `${system}/excelPublic/importDataInfo`// 导入用户
const getRoleList = `${system}/role/getRoleList`
const insertRole = `${system}/role/insertRole`
const delRoleById = `${system}/role/delRoleById`
const updateRoleById = `${system}/role/updateRoleById`
const getRoleUserList = `${system}/role/getRoleUserList`
const updateRoleInfoById = `${system}/role/updateRoleInfoById`// 修改角色基本信息
const updateRoleMenuById = `${system}/role/updateRoleMenuById`// 修改角色菜单关系
const insertRoleInfo = `${system}/role/insertRoleInfo`// 新增角色基本信息
const insertRoleMenu = `${system}/role/insertRoleMenu`// 新增角色菜单权限
const queryTasks = `${timer}/task/queryTasks`
const addJob = `${timer}/task/addJob`
const delJob = `${timer}/task/delJob`
const resumeJob = `${timer}/task/resumeJob`
const pauseJob = `${timer}/task/pauseJob`
const getCustomerList = `${system}/customer/getCustomerList`// 获取坐席列表
const insertCustomer = `${system}/customer/insertCustomer`// 新增坐席列表
const updateCustomer = `${system}/customer/updateCustomer`// 修改坐席列表
const delCustomer = `${system}/customer/delCustomer`// 删除坐席列表
const getDataRoleList = `${system}/dataRole/getDataRoleList`// 获取数据角色列表
const getRoleDeptList = `${system}/dataRole/getRoleDeptList`// 获取该角色下关联的部门
const insertDataRole = `${system}/dataRole/insertDataRole`// 新增数据角色列表
const updateDataRole = `${system}/dataRole/updateDataRole`// 修改数据角色列表
const delDataRole = `${system}/dataRole/delDataRole`// 删除数据角色列表
const getDeptList = `${system}/dept/getDeptList`// 获取部门列表
const getDeptTree = `${system}/dept/getDeptTree`// 获取部门树形列表
const insertDept = `${system}/dept/insertDept`// 新增部门列表
const updateDept = `${system}/dept/updateDept`// 修改部门列表
const delDept = `${system}/dept/delDept`// 删除部门列表
const getDeptCustomerList = `${system}/dept/getDeptCustomerList`// 获取部门绑定坐席数据
const addDeptAndCustomer = `${system}/dept/addDeptAndCustomer`// 关联坐席和部门关系
const getWorkList = `${system}/work/getWorkList`// 工单查询
const queryLogs = `${system}/operLog/queryLogs`// 日志查询
const getKey = `${system}/sm2/getKey`// 日志查询
const callInterface = `${work}/logQuery/callInterface`// 行为日志查询
const getDictitemInfo = `${work}/logQuery/getDictitemInfo`// 关键字
export default {
  userTemplate,
  getAllMenuList,
  verifyCode,
  getTreeMenuList,
  getAllMenuAndTree,
  getRoleMenuList,
  delMenuById,
  insertMenu,
  updateMenuById,
  addMenuButton,
  login,
  logout,
  getPhoneCode,
  getAllUsers,
  insertUser,
  delUserById,
  updateUserById,
  verifyUserName,
  addUserAndRole,
  importDataInfo,
  getRoleList,
  insertRole,
  delRoleById,
  updateRoleById,
  getRoleUserList,
  updateRoleInfoById,
  updateRoleMenuById,
  insertRoleInfo,
  insertRoleMenu,
  queryTasks,
  addJob,
  delJob,
  resumeJob,
  pauseJob,
  getCustomerList,
  insertCustomer,
  updateCustomer,
  delCustomer,
  getDataRoleList,
  insertDataRole,
  updateDataRole,
  delDataRole,
  getDeptList,
  insertDept,
  updateDept,
  delDept,
  getDeptTree,
  getRoleDeptList,
  getDeptCustomerList,
  addDeptAndCustomer,
  getWorkList,
  queryLogs,
  getKey,
  callInterface,
  getDictitemInfo,
}
