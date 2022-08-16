function paramJson(con, cmd) {
  const Json = {
    head: {
      aid: sessionStorage.aid,
      ver: '1.0',
      ln: sessionStorage.userName,
      mod: sessionStorage.mod,
      de: sessionStorage.de,
      sync: 1,
      cmd: cmd || 10008,
      uuid: 1,
      chcode: sessionStorage.accessToken,
    },
    con,
  }
  return Json
}
const minCellWidth = '140'
const btnRole = {
  SearchBtn: '查询',
  AddBtn: '新增',
  EditBtn: '修改',
  DelBtn: '删除',
  AuthBtn: '授权',
  PubBtn: '发布',
  OffBtn: '下线',
}
export default {
  paramJson,
  minCellWidth,
  btnRole,
}
