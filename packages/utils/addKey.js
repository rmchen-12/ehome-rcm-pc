/**
 * {id} => {id,key},
 * 在数据中添加key字段，因为蚂蚁组件接收数据时需要数据中携带key供React使用,
 * arg[0]:元数据,
 * arg[1]:哪个字段转换为key,
 */
const addKey = (data = [], id = 'id') => {
	return data.map(value => {
		return { ...value, key: value[id] };
	});
};

export default addKey;
