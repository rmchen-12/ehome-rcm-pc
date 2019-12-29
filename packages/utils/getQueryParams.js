/**
 * Created by rongzhx on 2017/12/8 0008.
 */
/**
 * 获取URL上的查询参数
 */
const getQueryParams = (param) => {
	const href = window.location.href;
	if (href === '') {
		return {};
	}
	let result = {},
		pos = [];

	// 获取所有?位置
	for (let i = 0; i < href.length; i++) {
		if (href[i] === '?') {
			pos.push(i);
		}
	}

	// 获取所有查询参数
	for (let i = 0; i < pos.length; i++) {
		if (i < pos.length - 1) {
			result = Object.assign({}, result, splitParams(href.substring(pos[i], pos[i + 1])));
		} else {
			result = Object.assign({}, result, splitParams(href.substring(pos[i])));
		}
	}
	if (param) {
		return result[param] || new Error(`url上未查询到${params}参数`)
	}
	return result;
};

const splitParams = (str) => {
	let result = {};
	if (str === '') {
		return {};
	}

	// 第1个为?，截掉
	str = str.substring(1);
	// str后边可能有hash值，截掉（/#/，#/，/#三种形式）
	let pos = 0;
	if (str.indexOf('#') > -1) {
		pos = str.indexOf('#');
		if (pos > 0 && str[pos - 1] === '/') {
			pos = pos - 1;
		}
	}
	if (pos > 0) {
		str = str.substring(0, pos);
	}
	let strArr = str.split('&');
	for (let i = 0; i < strArr.length; i++) {
		let temp = strArr[i].split('=');
		result[temp[0]] = temp[1];
	}
	return result;
};

export default getQueryParams;
