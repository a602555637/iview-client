import axios from '../libs/request'
import qs from 'qs'

// 获取用户列表
const getUserList = params => {
  axios.get('/admin/users?' + qs.stringify(params))
}

//
const updateUserById = data => axios.post('/admin/update-user', data)

const updateUserBatchById = data => axios.post('/admin/update-user-settings', data)

//
const deleteUserById = ids => axios.get('/admin/delete-user', { ids })

//
const checkUserName = username => axios.get('/admin/checkname?username=' + username)

// 添加用户
const addUser = data => axios.post('/admin/add-user', data)

// 菜单操作
const addMenu = (data) => axios.post('/admin/add-menu', data)
const getMenu = () => axios.get('/admin/get-menu')
const updateMenu = (data) => axios.post('/admin/update-menu', data)
const deleteMenu = (data) => axios.post('/admin/delete-menu', data)

// 角色权限
const addRole = (data) => axios.post('/admin/add-role', data)
const getRoles = () => axios.get('/admin/get-role')
const getRoleNames = () => axios.get('/admin/get-role-names')
const updateRole = (data) => axios.post('/admin/update-role', data)
const deleteRole = (data) => axios.post('/admin/delete-role', data)

export {
  getUserList,
  updateUserById,
  updateUserBatchById,
  deleteUserById,
  checkUserName,
  addUser,
  addMenu,
  getMenu,
  updateMenu,
  deleteMenu,
  addRole,
  getRoles,
  getRoleNames,
  updateRole,
  deleteRole
}
