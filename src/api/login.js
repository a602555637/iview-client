import axios from '../libs/request'

/**
 * 获取验证码
 * @param {String} sid 用户唯一标识
 */
const getCode = sid => {
  return axios.get('/public/getCaptcha', {
    params: {
      sid
    }
  })
}

/**
 * 找回密码
 * @param {} option 用户信息(email & code)
 */
const forget = option => {
  return axios.post('/forget', {
    ...option
  })
}

/**
 * 点击登陆
 * @param {*} loginInfo 用户登陆信息
 */
const login = loginInfo => {
  return axios.post('/login/login', {
    ...loginInfo
  })
}

/**
 * 注册
 * @param {*} regInfo 用户注册信息
 */
const reg = regInfo => {
  return axios.post('/login/reg', {
    ...regInfo
  })
}

export {
  getCode,
  forget,
  login,
  reg
}
