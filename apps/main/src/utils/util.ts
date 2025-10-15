
// @ts-ignore
import { VIEWNULL } from "@/config/config";
import { RouteObject } from "@/routers/interface";
import * as md5 from 'js-md5'
import { isObject } from "hoslink-xxx";
import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'
import localForage from 'localforage';

/**
 * @description 获取localStorage
 * @param {String} key Storage名称
 * @return string
 */
export const localGet = (key: string) => {
	const value = window.localStorage.getItem(key);
	try {
		return JSON.parse(window.localStorage.getItem(key) as string);
	} catch (error) {
		return value;
	}
};

/**
 * @description 存储localStorage
 * @param {String} key Storage名称
 * @param {Any} value Storage值
 * @return void
 */
export const localSet = (key: string, value: any) => {
	window.localStorage.setItem(key, JSON.stringify(value));
};

/**
 * @description 清除localStorage
 * @param {String} key Storage名称
 * @return void
 */
export const localRemove = (key: string) => {
	window.localStorage.removeItem(key);
};

/**
 * @description 清除所有localStorage
 * @return void
 */
export const localClear = () => {
	window.localStorage.clear();
};

/**
 * @description 获取浏览器默认语言
 * @return string
 */
export const getBrowserLang = () => {
  // @ts-ignore
	let browserLang = navigator.language ? navigator.language : navigator.browserLanguage;
	let defaultBrowserLang = "";
	if (browserLang.toLowerCase() === "cn" || browserLang.toLowerCase() === "zh" || browserLang.toLowerCase() === "zh-cn") {
		defaultBrowserLang = "zh";
	} else {
		defaultBrowserLang = "en";
	}
	return defaultBrowserLang;
};

/**
 * @description 获取需要展开的 subMenu
 * @param {String} path 当前访问地址
 * @returns array
 */
export const getOpenKeys = (path: string) => {
	let newStr: string = "";
	let newArr: any[] = [];
	let arr = path.split("/").map(i => "/" + i);
	for (let i = 1; i < arr.length - 1; i++) {
		newStr += arr[i];
		newArr.push(newStr);
	}
	return newArr;
};

/**
 * @description 递归查询对应的路由
 * @param {String} path 当前访问地址
 * @param {Array} routes 路由列表
 * @returns array
 */
export const searchRoute = (path: string, routes: RouteObject[] = []): RouteObject => {
	let result: RouteObject = {};
	for (let item of routes) {
		if (item.path === path) return item;
		if (item.children) {
			const res = searchRoute(path, item.children);
			if (Object.keys(res).length) result = res;
		}
	}
	return result;
};

/**
 * @description 递归当前路由的 所有 关联的路由，生成面包屑导航栏
 * @param {String} path 当前访问地址
 * @param {Array} menuList 菜单列表
 * @returns array
 */
// @ts-ignore
export const getBreadcrumbList = (path: string, menuList: Menu.MenuOptions[]) => {
	let tempPath: any[] = [];
	try {
    // @ts-ignore
		const getNodePath = (node: Menu.MenuOptions) => {
			tempPath.push(node);
			// 找到符合条件的节点，通过throw终止掉递归
			if (node.path === path) {
				throw new Error("GOT IT!");
			}
			if (node.children && node.children.length > 0) {
				for (let i = 0; i < node.children.length; i++) {
					getNodePath(node.children[i]);
				}
				// 当前节点的子节点遍历完依旧没找到，则删除路径中的该节点
				tempPath.pop();
			} else {
				// 找到叶子节点时，删除路径当中的该叶子节点
				tempPath.pop();
			}
		};
		for (let i = 0; i < menuList.length; i++) {
			getNodePath(menuList[i]);
		}
	} catch (e) {
		return tempPath.map(item => item.title);
	}
};

/**
 * @description 双重递归 找出所有 面包屑 生成对象存到 redux 中，就不用每次都去递归查找了
 * @param {String} menuList 当前菜单列表
 * @returns object
 */
// @ts-ignore
export const findAllBreadcrumb = (menuList: Menu.MenuOptions[]): { [key: string]: any } => {
	let handleBreadcrumbList: any = {};
  // @ts-ignore
	const loop = (menuItem: Menu.MenuOptions) => {
		// 下面判断代码解释 *** !item?.children?.length   ==>   (item.children && item.children.length > 0)
		if (menuItem?.children?.length) menuItem.children.forEach(item => loop(item));
		else handleBreadcrumbList[menuItem.path] = getBreadcrumbList(menuItem.path, menuList);
	};
	menuList.forEach(item => loop(item));
	return handleBreadcrumbList;
};

/**
 * @description 使用递归处理路由菜单，生成一维数组，做菜单权限判断
 * @param {Array} menuList 所有菜单列表
 * @param {Array} newArr 菜单的一维数组
 * @return array
 */
// @ts-ignore
export function handleRouter(routerList: Menu.MenuOptions[], newArr: string[] = []) {
  // @ts-ignore
	routerList.forEach((item: Menu.MenuOptions) => {
		typeof item === "object" && item.path && newArr.push(item.path);
		item.children && item.children.length && handleRouter(item.children, newArr);
	});
	return newArr;
}

/**
 * @description 判断数据类型
 * @param {Any} val 需要判断类型的数据
 * @return string
 */
export const isType = (val: any) => {
	if (val === null) return "null";
	if (typeof val !== "object") return typeof val;
	else return Object.prototype.toString.call(val).slice(8, -1).toLocaleLowerCase();
};

/**
 * @description 对象数组深克隆
 * @param {Object} obj 源对象
 * @return object
 */
export const deepCopy = <T>(obj: any): T => {
	let newObj: any;
	try {
		newObj = obj.push ? [] : {};
	} catch (error) {
		newObj = {};
	}
	for (let attr in obj) {
		if (typeof obj[attr] === "object") {
			newObj[attr] = deepCopy(obj[attr]);
		} else {
			newObj[attr] = obj[attr];
		}
	}
	return newObj;
};


/**
 * @desc 格式化GET请求的参数
 * @example formatQueryParam({label: '全部', value: ''})
 * @param {object}  obj - {label: '全部', value: ''}
 * @return {string} - 默认返回空字符串
 */
export const formatQueryParam = function (obj) {
  obj = formatPostTrim(obj);
  let temp = '';
  if (Object.prototype.toString.call(obj) === '[object Object]') {
    for (const key in obj) {
      if (Array.isArray(obj[key])) {
        obj[key].forEach(elem => {
          temp += `${key}=${elem}&`;
        });
      } else {
        if (obj[key] !== null) {
          temp += `${key}=${obj[key]}&`;
        } else {
          temp += `${key}=&`;
        }
      }
    }
  }

  if (temp.length > 0) {
    temp = `?${temp}`;
    return temp.substring(0, temp.length - 1);
  } else {
    return '';
  }
};
// * 格式化POST请求的参数
export const formatPostTrim = function (data: Array<any> | Object) {
  everyTrim(data);
  return data;
};
// * 递归格式化POST请求的参数
export const everyTrim = function (data: Array<any> | Object) {
  for (const key in data) {
    if (typeof data[key] === 'object') {
      everyTrim(data[key]);
    } else {
      if (typeof data[key] === 'string') {
        data[key] = trim(data[key]);
      }
    }
  }
};

/**
 * 去除字符串空格
 * @param {string} str
 * @param {Boolean} global
 * @returns {string}
 */
export const trim = function (str: string, global: Boolean = false) {
  let result = str.replace(/(^\s+)|(\s+$)/g, '');
  if (global) {
    result = result.replace(/\s/g, '');
  }
  return result;
};
/**
 *
 * @method {*} encrypt 密码加密
 * @param {*} pwd 密码
 * @param {*} key 公钥
 * @return secretPwd 加密后的密码
 */
export const encrypt = (pwd: string, key: string) => {
  const encrypt = new JSEncrypt()
  const privitekey =
    '-----BEGIN RSA PUBLIC KEY-----\n' + key + '\n-----END PUBLIC KEY-----'
  encrypt.setPublicKey(privitekey)
  const secretPwd = encrypt.encrypt(pwd)
  return secretPwd
}
/**
 * @description 密码加密
 * @param str 密码
 * @returns 加密后的密码
 */
export const pwdencryptMD5 = function (str: string) {
  if (!str) {
    return '';
  }
  if (/^@@@chuanyue/.test(str)){
    return str
  }
  const identifying = '@@@chuanyue';
  str = trim(str).toString();
  if (str.search(identifying) === 0) {
    return str;
  } else {
    return identifying + md5.hex(str);
  }
}
// * 16进制字符串转普通字符串
export const hextoString = (hex: string) => {
  let arr = hex.split("")
  let out = ""
  for (let i = 0; i < arr.length / 2; i++) {
    let tmp: any = "0x" + arr[i * 2] + arr[i * 2 + 1]
    let charValue = String.fromCharCode(tmp);
    out += charValue
  }
  return out;
}
// * Base64 解码
export const Base64 = input => {
  // private property
  const _keyStr =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  // public method for encoding

  // public method for decoding
  //            this.decode = function (input) {
  let output = '';
  let chr1, chr2, chr3;
  let enc1, enc2, enc3, enc4;
  let i = 0;
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
  while (i < input.length) {
    enc1 = _keyStr.indexOf(input.charAt(i++));
    enc2 = _keyStr.indexOf(input.charAt(i++));
    enc3 = _keyStr.indexOf(input.charAt(i++));
    enc4 = _keyStr.indexOf(input.charAt(i++));
    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;
    output = output + String.fromCharCode(chr1);
    if (enc3 !== 64) {
      output = output + String.fromCharCode(chr2);
    }
    if (enc4 !== 64) {
      output = output + String.fromCharCode(chr3);
    }
  }
  output = _utf8_decode(output);
  return output;
  //            }

  // private method for UTF-8 encoding

  // private method for UTF-8 decoding
  function _utf8_decode(utftext) {
    let string = '';
    let i = 0;
    let c = 0;
    let c3 = 0;
    let c2 = 0;
    while (i < utftext.length) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if (c > 191 && c < 224) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(
          ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63),
        );
        i += 3;
      }
    }
    return string;
  }
};

/**
 * 对象克隆
 * @param obj
 * @returns {any[] | {}}
 */
 export const cloneObj = function (obj): any {
  let str,
    newobj = obj.constructor === Array ? [] : {};
  if (typeof obj !== 'object') {
    return;
  } else if (JSON) {
    (str = JSON.stringify(obj)), (newobj = JSON.parse(str));
  } else {
    for (const i in obj) {
      newobj[i] = typeof obj[i] === 'object' ? cloneObj(obj[i]) : obj[i];
    }
  }
  return newobj;
};

/**
 * 版本号对比
 * @param currentV 当前版本号
 * @param serverV 服务器版本号
 * @returns {boolean} true:当前版本号大于等于服务器版本号
 */
export const compareVer = (currentV, serverV) => {
  const currentVer = currentV.split('.')
  const serverVer = serverV.split('.')
  let bool = false
  let a = true
  bool = serverVer.some((e, idx) => {
    if (Number(currentVer[idx]) < Number(e)) a = false
    return Number(currentVer[idx]) > Number(e)
  })
  return bool && a
}

/**
 * 深度合并对象(当前用于合并系统配置文件 app-data.json)
 * （已存在的属性不覆盖）
 * @param oldObj 旧对象
 * @param newObj 新对象
 * @param keys 强制覆盖属性的数组
 */
 export const mergeObj = (oldObj: Object, newObj: Object, keys = [
  'version',
  'templates',
  'bloodUserForm'
]) => {
  for (const key in newObj) {
    if (isObject(newObj[key]) && isObject(oldObj[key])) {
      oldObj[key] = mergeObj(oldObj[key], newObj[key], keys);
    } else if (Object.keys(oldObj).includes(key) && !keys.includes(key)) {

    } else {
      oldObj[key] = newObj[key];
    }

    // oldObj[key] = isObject(newObj[key]) && isObject(oldObj[key]) && mergeObj(oldObj[key],newObj[key],keys) || Object.keys(oldObj).includes(key) && !keys.includes(key) && oldObj[key] || newObj[key]
  }

  for (const key in oldObj) {
    if (newObj[key] === undefined) {
      delete oldObj[key];
    }
  }

  return oldObj;
};

// * 设置localForage
export const setLocalForage = async (key: string, value: any) => {
  await localForage.setItem(key, value);
}
// * 获取localForage
export const getLocalForage = async (key: string) => {
  return await localForage.getItem(key);
}
// * 移除localForage
export const removeLocalForage = async (key: string) => {
  await localForage.removeItem(key);
}

/**
 * 获取对象属性值
 * @param args
 * @returns {string}
 */
 export const getV = (...args) =>
 args.length >= 2
   ? args.reduce((a, b) => (a && a.hasOwnProperty(b+'A') ? a[b+'A'] : a && a.hasOwnProperty(b) ? a[b] : VIEWNULL))
   : VIEWNULL;

/**
 * 判断对象是否为空
 * @param obj 
 * @returns 
 */

export function isEmptyObject(obj) {
  if (obj === null || obj === undefined) return true;
  if (typeof obj !== 'object') return true; // 非对象直接判空
  // 进一步检测是否为空对象
  return Object.keys(obj).length === 0;;
}

/**
 * 数组转换对象
 * @param arr 数组
 * @param key 数组元素的键名
 * @returns 
 */
export const arrTransObj = function (arr: Array<any>, key: string) {
  const temp = {};
  arr.forEach(d => {
    temp[d[key]] = d;
  });
  return temp;
};
/**
 * 数组转换树结构
 * @param rows 数组
 * @returns 
 */
export const convert = function (rows: Array<any>) {
  function exists(row, parentId) {
    for (let i = 0; i < rows.length; i++) {
      if (row[i].id === parentId) return true;
    }
    return false;
  }

  const nodes = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!exists(rows, row.parentId)) {
      nodes.push({ ...row, title: row.name, key: row.id });
    }
  }

  const toDo = [];
  for (let i = 0; i < nodes.length; i++) {
    toDo.push(nodes[i]);
  }
  while (toDo.length) {
    const node = toDo.shift();
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (row.parentId === node.id) {
        const child = { ...row, title: row.name, key: row.id };
        if (node.children) {
          node.children.push(child);
        } else {
          node.children = [child];
        }
        toDo.push(child);
      }
    }
  }
  return nodes;
};

/**
 * 统计去重 根据 key
 * @param arr
 * @param key
 * @returns {any[]}
 */
export const tableRepeat = function (arr, ...key) {
  arr.forEach((d, i) => {
    for (let j = i + 1; j < arr.length; j++) {
      let sort = true;
      key.forEach((e, g) => {
        if (d[key[g]] !== arr[j][key[g]]) {
          sort = false;
        }
      });
      // if (d[key[0]] === arr[j][key[0]] && d[key[1]] === arr[j][key[1]] && d[key[2]] === arr[j][key[2]] && d[key[3]] === arr[j][key[3]]) {
      if (sort) {
        d.aPos = parseFloat(d.aPos) + parseFloat(arr[j].aPos);
        d.bPos = parseFloat(d.bPos) + parseFloat(arr[j].bPos);
        d.oPos = parseFloat(d.oPos) + parseFloat(arr[j].oPos);
        d.abPos = parseFloat(d.abPos) + parseFloat(arr[j].abPos);
        d.aNeg = parseFloat(d.aNeg) + parseFloat(arr[j].aNeg);
        d.bNeg = parseFloat(d.bNeg) + parseFloat(arr[j].bNeg);
        d.oNeg = parseFloat(d.oNeg) + parseFloat(arr[j].oNeg);
        d.abNeg = parseFloat(d.abNeg) + parseFloat(arr[j].abNeg);
        arr.splice(j, 1);
        j--;
      }
    }
  });

  return arr;
};