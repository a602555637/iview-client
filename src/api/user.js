import axios from '@/libs/request'
import { getToken } from '@/libs/util'

const getUserInfo = (token) => {
  return axios.get('/public/info', {
    headers: {
      // eslint-disable-next-line quote-props
      'Authorization': 'Beaerer ' + getToken()
    }
  })
}

export { getUserInfo }
