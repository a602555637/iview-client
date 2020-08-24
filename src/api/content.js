import axios from '@/libs/request'
import qs from 'qs'

const getList = options => {
  return axios.get('/public/list?' + qs.stringify(options))
}

const deletePostById = id => {
  return axios.get('/content/delete?tid=' + id)
}

const updatePostById = data => {
  return axios.post('/content/update-id', data)
}

export {
  getList,
  deletePostById,
  updatePostById
}
