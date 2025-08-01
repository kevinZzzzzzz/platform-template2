import { setToken } from "@repo/store/lib/global";
import { store } from "@/store";
import RequestHttp from '@repo/http/lib'
import { formatQueryParam } from "@/utils/util";
import { base_uri } from "./config/servicePort";

const config = {
	// 默认地址请求地址，可在 .env 开头文件中修改
	baseURL: '',
	// 设置超时时间（10s）
	timeout: 10000,
	// 跨域时候允许携带凭证
	withCredentials: true,
  token: store.getState().auth?.token || '',
};

// 设置代理
export const setProxy = (url: string): string => {
  return !import.meta.env.PROD ? '/proxyApi/' + url : url
}
// * 补全url
const completePrefixUrl = (url: string) => {
  // const hosToStaPath = localStorage.getItem('hosToStaPath') || '/station/'
  const prefix = window.location.origin
  return `${prefix}${setProxy(base_uri + url)}`
};

const http = new RequestHttp(config);
console.log(http, 'http000')
// * 本地获取数据
http.localGet = (url: string, params?: object, _object = {}) => {
  return http.get(url, params, _object)
}
// * 格式化GET请求的参数
http._get = (url: string, params?: object, _object = {}) => {
  const _url = params ? `${url}${formatQueryParam(params)}` : url;
  return http.get(completePrefixUrl(_url), params, _object)
}
// * 格式化POST请求的参数
http._post = (url: string, params?: object, _object = {}) => {
  return http.post(completePrefixUrl(url), params, _object)
}

http._put = (url: string, params?: object, _object = {}) => {
  return http.put(completePrefixUrl(url), params, _object)
}
http._delete = (url: string, params?: object, _object = {}) => {
  return http.delete(completePrefixUrl(url), params, _object)
}

console.log(http)


export default http;
