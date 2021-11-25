import axios from 'axios'

import {
  getToken
} from './auth'

// axios.defaults.baseUrl = process.env.VUE_APP_BASE_API //默认接口地址前缀
//
// axios.defaults.timeout = 15000 //请求超时时间
let BASE_API;

axios.get("/conf.json").then(res=> {
  console.log(res);
  BASE_API = res.data.api;
}).catch(err => {
  Message({
    message: '读取配置文件失败, 请检查conf.json文件',
    type: 'error',
    duration: 5 * 1000
  })
});


const server = axios.create({
  baseURL: BASE_API,
  withCredentials: true,
  timeout: 15000
});

server.interceptors.request.use(
    config => {
      const token = getToken()
      if (token) {
        config.headers['Cookie'] = token
      }
      return config
    },
    error => {
      return Promise.reject(error)
    }
)

// response interceptor
server.interceptors.response.use(
    response => {
      const res = response.data
      if (res) return res
    },
    error => {
      /* 请求错误时*/
      if (error.code == 'ECONNABORTED' && error.message.indexOf('timeout') != -1) {
        var config = error.config
        config.__retryCount = config.__retryCount || 0

        if (config.__retryCount >= config.retry) {
          return Promise.reject(error)
        }
        config.__retryCount += 1
        var backoff = new Promise(function (resolve) {
          setTimeout(function () {
            resolve()
          }, config.retryDelay || 1)
        })

        return backoff.then(function () {
          return axios(config)
        })
      } else {
        if (error.message === 'Network Error') {
          error.message = '请求失败,请重试'
        }
        return Promise.reject(error)
      }
    }
)


const http = {
  get(url, params={}) {
    return server.get(url, {
      params: params,
    })
  },
  post(url, data = {}) {
    return server.post(url, {
      data: data,
    })
  },
  requestAll(...fn) {
    return server.all(...fn)
  }
}

export default http
