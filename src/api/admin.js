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

export {
  getUserList,
  updateUserById,
  updateUserBatchById,
  deleteUserById,
  checkUserName,
  addUser
}
