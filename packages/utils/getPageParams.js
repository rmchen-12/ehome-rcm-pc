import { getUrlQuery } from './index';

/**
 * 解析当前的 PageParams
 * */
export const analyzePageParams = pageParams => {
  let pages = {};
  pageParams = decodeURIComponent(pageParams);

  const pagesArray = pageParams.split('&').filter(i => i);
  pagesArray.forEach(item => {
    let params = {};
    const arr = item.split('=');
    if (arr[1]) {
      const paramsArray = arr[1].split('|');
      paramsArray.forEach(param => {
        const paramArr = param.split('^');
        params[paramArr[0]] = paramArr[1];
      });
      pages[arr[0]] = params;
    }
  });
  return pages;
};

/**
 * 设置新的 PageParams
 *
 * @return {string} return the new pageParams. (eg. 对 pageA=id^1|name^hl&pageB=id^2|size^12 进行编码后的字符串)
 * */
const setPageParams = pages => {
  let params = '';
  for (let i in pages) {
    if (typeof pages[i] === 'object') {
      let subParams = '';
      for (let j in pages[i]) {
        subParams += `|${j}^${pages[i][j]}`;
      }
      subParams = subParams.substring(1);
      params += `&${i}=${subParams}`;
    }
  }
  params = params.substring(1);

  return encodeURIComponent(params);
};

/**
 * 解析当前的url，返回一个存有当前及相关页面的search参数的字符串
 *
 * @param {object} location  props.location
 * @return {string} return the PageParams (eg. pageParams=***，***部分为 pageA=id^1|name^hl&pageB=id^2|size^12 进行编码后的字符串，
 * 注意此处有2级数据，第一级以 = 连接key、value，以 & 分隔；第二级以 ^ 连接key、value，以 | 分隔)
 * */
const getPageParams = location => {
  const { pathname, search } = location;
  const pathSnippets = pathname.split('/').filter(i => i);
  const currentPath = pathSnippets[pathSnippets.length - 1];

  const query = getUrlQuery(search);
  let pageParams = query.pageParams;
  delete query.pageParams;

  let pages = pageParams ? analyzePageParams(pageParams) : {};
  pages[currentPath] = query;

  const params = setPageParams(pages);

  return `pageParams=${params}`;
};

export default getPageParams;
