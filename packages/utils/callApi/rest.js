import 'isomorphic-fetch';
import { isObject } from './misc';
import { message } from 'antd';
import bignumJSON from '../bignumJSON';
import { localStorage } from '../index';
import FormData from 'form-data';

const noop = () => {};
//是否传空参数值
let isNeedEmpty = false;

function prepend(prefix, name, separator) {
  if (prefix) {
    if (separator) {
      return prefix + '.' + name;
    }

    return prefix + name;
  }
  return name;
}

function flatten(prefix, obj, map) {
  if (!isNeedEmpty && !(obj || obj === 0)) {
    return;
  }
  if (obj !== undefined) {
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        var item = obj[i];
        flatten(prepend(prefix, '[' + i + ']', false), item, map);
      }
    } else if (isObject(obj)) {
      if (obj.__type__ === 'map') {
        for (let key in obj) {
          if (key !== '__type__') {
            flatten(prepend(prefix, '[' + key + ']', false), obj[key], map);
          }
        }
      } else if (obj instanceof File) {
        // deal with JS based file load
        map[prefix] = obj;
      } else {
        for (let key in obj) {
          flatten(prepend(prefix, key, true), obj[key], map);
        }
      }
    } else {
      map[prefix] = obj;
    }
  }
}

export function toFlattenMap(obj) {
  let map = {};
  isNeedEmpty = false;
  if (obj.isNeedEmpty) {
    delete obj.isNeedEmpty;
    isNeedEmpty = true;
  }
  flatten(null, obj, map);
  return map;
}

export function composeFetch(service, endpoint, data, headers) {
  let fullUrl = service ? service + endpoint : endpoint;

  let method = !!data && !!data.method ? data.method : 'POST';

  if (method === 'POST') {
    let params = new FormData();
    if (!!data && !!data.commandObject) {
      let flattenMap = toFlattenMap(data.commandObject);
      for (let key in flattenMap) {
        params.append(key, flattenMap[key]);
      }
    }
    return {
      fullUrl,
      fetchData: {
        headers,
        credentials: 'include',
        method,
        body: params
      }
    };
  }
  let params = [];
  if (!!data && !!data.commandObject) {
    let flattenMap = toFlattenMap(data.commandObject);

    let i = 0;
    for (let key in flattenMap) {
      if (i++ === 0) {
        params.push('?');
      } else {
        params.push('&');
      }

      params.push(
        encodeURIComponent(key) + '=' + encodeURIComponent(flattenMap[key])
      );
    }

    if (params.length > 0) {
      fullUrl = fullUrl + params.join('');
    }
  }

  return {
    fullUrl,
    fetchData: {
      credentials: 'include',
      method
    }
  };
}

export function callApi(service) {
  let {
    service: prefix = '/evh',
    api,
    data: commandObject = {},
    method,
    success = noop,
    error,
    promise = false,
    ignoreNamespaceId = false,
    complete = noop
  } = service;
  // 自动加上 namespaceId 参数
  let namespaceId = window.$$context && window.$$context.namespaceId;
  if (!ignoreNamespaceId)
    commandObject = Object.assign({ namespaceId }, commandObject);
  const fetchInfo = composeFetch(prefix, api, { commandObject, method });
  return new Promise((resolve, reject) => {
    const fetchPromise = fetch(fetchInfo.fullUrl, fetchInfo.fetchData)
      .then(response => {
        return response.text().then(text => text);
      })
      .then(response => {
        const data = bignumJSON.parse(response);
        if (promise) {
          if (Number(data.errorCode) === 200) {
            return resolve(data.response);
          }
          return reject(data);
        }
        if (Number(data.errorCode) === 200) {
          success(data.response);
        } else {
          if (error) {
            error(data);
          } else {
            message.error(data.errorDescription || '系统异常，请稍候再试', 1.5);
          }
        }
      })
      .catch(err => {
        console.error(err);
      });
    if (!('finally' in fetchPromise))
      fetchPromise.finally = Promise.prototype.finally;
    fetchPromise.finally(() => {
      if (complete) {
        complete();
      }
    });
  });
}

export function callRaw(service, endpoint, data, headers) {
  let fetchInfo = composeFetch(service, endpoint, data, headers);
  return fetch(fetchInfo.fullUrl, fetchInfo.fetchData);
}
