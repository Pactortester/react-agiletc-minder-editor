import { cloneDeep, isEmpty, isUndefined } from "lodash";

/**
 * @desc 获取地址栏的参数
 * @param {string} name 要获取的参数名称
 */
export function getQueryString(name) {
  var reg = new RegExp(name + "=([^&]*)", "i");
  var r = window.location.href.match(reg);
  if (r !== null) {
    return r[1];
  } else {
    return null;
  }
}

/**
 * @desc 判断数据是否为JSON字符串
 * @param {string} name 要判断的字符串
 */
export function isJsonString(name) {
  try {
    if (typeof JSON.parse(name) == "object") {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

/**
 * @desc 生成随机字符串
 * @param {string} name 要判断的字符串
 */
export function randomString(len) {
  len = len || 32;
  const $chars =
    "abcdefghijklmnopqrstuvwxyz123456789"; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  const maxPos = $chars.length;
  var pwd = "";
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

// /**
//  * @desc 模拟键盘事件
//  * @param {string} name 要判断的字符串
//  */
// export function fireKeyEvent(el, keyCode) {
//     var evtObj;
//     if (document.createEvent) {
//         if (window.KeyEvent) {   //firefox 浏览器下模拟事件
//             evtObj = document.createEvent('KeyEvents');
//             evtObj.initKeyEvent(evtType, true, true, window, true, false, false, false, keyCode, 0);
//         } else {   //chrome 浏览器下模拟事件
//             evtObj = document.createEvent('HTMLEvents');
//             evtObj.initEvent('input', true, true);
//             evtObj.keyCode = keyCode;
//         }
//         el.dispatchEvent(evtObj);

//     } else if (document.createEventObject) {   //IE 浏览器下模拟事件
//         evtObj = document.createEventObject();
//         evtObj.keyCode = keyCode
//         el.fireEvent('on' + evtType, evtObj);
//     }
// }

/**
 * [格式化路由：将路由中的projectId -> projectName]
 * @param  {Array}  routes        [路由]
 * @param  {Object} projectInfo [项目信息]
 * @return {[type]}               [description]
 */
export function parseRouteWithInfo(
  routes = [],
  projectInfo = {},
  componentInfo = {}
) {
  const projectReg = /:projectId/g;
  const componentReg = /:componentId/g;
  const parsedRoute = routes.map(function (item) {
    const itemCopy = cloneDeep(item);
    if (projectReg.test(item.path) && !isEmpty(projectInfo)) {
      itemCopy.breadcrumbName = projectInfo.name;
    }
    if (componentReg.test(item.path) && !isUndefined(componentInfo.name)) {
      itemCopy.breadcrumbName = componentInfo.name;
    }
    return itemCopy;
  });
  return parsedRoute;
}

/**
 * [格式化路由：将路由中breadcrumbName为空的过滤掉]
 * @param  {Array}  routes        [description]
 * @param  {Object} classroomInfo [description]
 * @return {[type]}               [description]
 */
export function parseRouteForBreadcrumb(routes = []) {
  // 将url拼接
  const parsedUrl = routes.map((item, index) => {
    const newRoute = routes.slice(0, index + 1).map((newItem) => {
      return newItem.url;
    });
    return {
      url: "/" + newRoute.join("/"),
      breadcrumbName: item.breadcrumbName,
    };
  });
  // 过滤breadcrumbName为空
  const parsedRoute = parsedUrl.filter((item) => {
    if (!isEmpty(item.breadcrumbName) && !isUndefined(item.breadcrumbName))
      return item;
  });
  return parsedRoute;
}

/**
 * [获取图片url对应的宽高]
 * @param  {string}  url        [description]
 */
export function loadImageSize(url) {
  return new Promise((resolve, reject) => {
    var img = document.createElement("img");
    img.onload = function () {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = function () {
      reject(null);
    };
    img.src = url;
  });
}
