import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios"
import { message } from "antd"
// import "nprogress/nprogress.css";
// import NProgress from "nprogress";
import { AxiosCanceler } from "./axiosCancel"
import { showFullScreenLoading, tryHideFullScreenLoading } from "./utils"
import { requestTimeout } from "./config"
import { checkStatus } from "./checkStatus"

// NProgress.configure({
// 	easing: "ease", // 动画方式
// 	speed: 500, // 递增进度条的速度
// 	showSpinner: true, // 是否显示加载ico
// 	trickleSpeed: 200, // 自动递增间隔
// 	minimum: 0.3 // 初始化时的最小百分比
// });

const requireMap = new Map() // 接口缓存器
const axiosCanceler = new AxiosCanceler()

// * 请求响应参数(不包含data)
interface Result {
  code: string
  msg: string
}

// * 请求响应参数(包含data)
interface ResultData<T = any> extends Result {
  data?: T
}

class RequestHttp {
  service: AxiosInstance
  baseURL: string
  timeOut: number
  token: string
  withCredentials: boolean
  constructor(
    config: AxiosRequestConfig & {
      token: string
    }
  ) {
    this.token = config.token || ""
    this.baseURL = config.baseURL || location.origin || ""
    this.timeOut = config.timeout || requestTimeout
    this.withCredentials = config.withCredentials || false
    this.service = axios.create({
      baseURL: this.baseURL || "",
      timeout: this.timeOut || 5000,
      withCredentials: this.withCredentials || false,
    })

    /**
     * @description 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token校验(JWT) : 接受服务器返回的token
     */
    this.service.interceptors.request.use(
      (config: any) => {
        console.log(config, "config--------")
        // NProgress.start();

        // * 将当前请求添加到 pending 中
        axiosCanceler.addPending(config)
        // * 如果当前请求不需要显示 loading,在api服务中通过指定的第三个参数: { headers: { noLoading: true } }来控制不显示loading
        config.headers!.noLoading || showFullScreenLoading()

        return { ...config, headers: { ...config.headers, token: this.token } }
      },
      (error: any) => {
        return Promise.reject(error)
      }
    )

    /**
     * @description 响应拦截器
     *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(response, "response--------")
        // NProgress.done();
        const { data, config, status } = response
        // * 在请求结束后，移除本次请求(关闭loading)
        axiosCanceler.removePending(config)
        tryHideFullScreenLoading()
        return new Promise((resolve, reject) => {
          if (+status === 200) {
            // * 如果当前请求不需要显示 message,在api服务中通过指定的第三个参数: { headers: { noMessage: true } }来控制不显示message
            switch (+data.code) {
              case 0: // 正常返回
                config.headers!.noMessage || message.success(data.msg)
                resolve(data)
                break
              case 200: // 正常返回
                config.headers!.noMessage || message.success(data.msg)
                resolve(data)
                break
              // * 处理异常返回
              default:
                // config.headers!.noMessage || 
                message.error(data.msg)
                reject(data)
                break
            }
          } else {
            reject(data)
          }
        })
      },
      async (error: AxiosError) => {
        const {
          request: { status },
        } = error
        // NProgress.done();
        // config.headers!.noMessage || 
        checkStatus(status)
        tryHideFullScreenLoading()
        return Promise.reject(error)
      }
    )
  }
  // * 常用请求方法封装
  get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.get(url, { params, ..._object })
  }
  post<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.post(url, params, _object)
  }
  put<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.put(url, params, _object)
  }
  delete<T>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
    return this.service.delete(url, { params, ..._object })
  }
}

export default RequestHttp
