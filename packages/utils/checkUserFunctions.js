/**
 * Created by zhangruilin on 2018/1/24
 */
import {callApi} from './callApi/rest';
let AUTHLIST = [];
/**
 * 获取用户所有权限
 * @param self
 * @param namespaceId
 * @param communityId
 * @param organizationId
 * @param moduleId
 * @param categoryId
 */
const getAuth = (self, namespaceId, communityId, organizationId, moduleId, categoryId) => {
	callApi({
		api: '/module/listUserServiceModulefunctions',
		data: {
			namespaceId,
			communityId,
			organizationId,
			moduleId,
			categoryId,
		},
		success: (data) => {
			AUTHLIST = data;
			self.forceUpdate();
		}
	});
};

/**
 * 通过权限决定是否渲染组件
 * @param component
 * @param authId
 * @return component
 */
const checkAuth = (component, authId) => AUTHLIST.includes(authId) ? component : null;

/**
 * 判断权限是否存在
 * @param component
 * @param authId
 * @return Boolean
 */
const hasAuthFlag = (authId) => AUTHLIST.includes(authId);

export default {getAuth, checkAuth, hasAuthFlag};

/*
 *下面是一些功能id（不属于权限，若属于权限，与权限id相同）
 99 同步客户
 98 同步合同
 97 同步客户资料
 * */
