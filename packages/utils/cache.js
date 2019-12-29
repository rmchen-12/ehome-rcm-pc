var timeout = require('infinite-timeout');
var events = require('backbone-events-standalone');

/**
 * Find out if an object has a certain property
 *
 * @param {object} object
 * @param {string} key
 */
function has (object, key) {
	return Object.prototype.hasOwnProperty.call(object, key);
}

/**
 * Cache class
 */
function Cache () {
	this.initialize.apply(this, arguments);
}
var _ = Cache.prototype;
events.mixin(_);

/**
 * Constructor
 *
 * @param {object} external Forward set, get, clear and del commands to an external handler (optional)
 */
_.initialize = function (external) {
	this.store = {};
	this.external = external;
};

/**
 * Insert or overwrite data
 *
 * @param {string} key
 * @param {mixed} value
 * @param {number} ttl   Time to live in milliseconds (optional)
 */
_.set = function (key, value, ttl) {
	if (typeof key === 'undefined') throw new Error('Required argument key is undefined');

	// Clear timeout on existing record
	var oldRecord = has(this.store, key) ? this.store[key] : undefined;
	if (oldRecord && oldRecord.timeout) {
		timeout.clear(oldRecord.timeout);
	}

	// Set value + timeout on new record
	var record = { value: value };
	if (typeof ttl === 'number') {
		record.timeout = timeout.set(this.delInternal.bind(this, key), ttl);
	}
	this.store[key] = record;

	// Call external handler
	if (this.external && typeof this.external.set === 'function') {
		this.external.set(key, value, ttl);
	}

	// Emit update/set events
	var action = oldRecord ? 'update' : 'set';
	this.trigger(action, key, value, ttl);
	this.trigger(action + ':' + key, value, ttl);
};

/**
 * Get cached data
 *
 * @param {string} key
 * @param {function} callback  Return value in callback if records exists locally or on external resource (optional)
 * @return {mixed} value Only returned if callback is undefined
 */
_.get = function (key, callback) {
	if (typeof key === 'undefined') throw new Error('Required argument key is undefined');
	if (has(this.store, key)) {
		if (typeof callback === 'function') {
			process.nextTick(callback.bind(null, this.store[key].value));
		} else {
			return this.store[key].value;
		}
	} else if (typeof callback === 'function' && this.external && typeof this.external.get === 'function') {
		this.external.get(key, callback);
	}
};

/**
 * Delete cached data
 *
 * @param {string} key
 * @return {boolean} Returns true if record existed
 */
_.del = function (key) {
	if (typeof key === 'undefined') throw new Error('Required argument key is undefined');
	if (this.external && typeof this.external.del === 'function') {
		this.external.del(key);
	}
	return this.delInternal(key);
};

_.delInternal = function (key) {
	if (has(this.store, key)) {
		// Clear timeout
		if (this.store[key].timeout) {
			timeout.clear(this.store[key].timeout);
		}

		// Delete record
		delete this.store[key];

		// Emit del events
		this.trigger('del', key);
		this.trigger('del:' + key);
		return true;
	}
	return false;
};

/**
 * Clear cached data
 *
 * @return {number} Returns number of cleared records
 */
_.clear = function () {
	var size = this.size();
	this.store = {};
	if (this.external && typeof this.external.clear === 'function') {
		this.external.clear();
	}
	this.trigger('clear', size);
	return size;
};

/**
 * Retrieve number of records
 *
 * @return {number}
 */
_.size = function () {
	var size = 0;
	for (var key in this.store) {
		if (has(this.store, key)) size++;
	}
	return size;
};

/**
 * Retrieve internal store
 *
 * @return {object}
 */
_.debug = function () {
	return this.store;
};

/**
 * 设置pageState或pageStateSaved中的数据
 * @param {*} dataType src/functions中的dataType或src/components中的组件名
 * @param {*} key dataType下缓存中的key
 * @param {*} value dataType下缓存中对应的value
 * @param {*} isSaved 是否是pageStateSaved中数据。0：否；1：是。默认0
 */
_.setPageState = function (dataType, key, value, isSaved = 0) {
	let cacheKey = Number(isSaved) === 0 ? 'pageState' : 'pageStateSaved',
		data = this.get(cacheKey);

	// pageState或pageStateSaved还不存在
	if (data === undefined || data === 'undefined') {
		let obj = {}, childObj = {};
		childObj[key] = value;
		obj[dataType] = childObj;
		this.set(cacheKey, obj);
	} else {
		// dataType还不存在
		if (!has(data, dataType)) {
			let childObj = {};
			childObj[key] = value;
			data[dataType] = childObj;
			this.set(cacheKey, data);
		} else {
			let tempData = data[dataType];
			tempData[key] = value;
			this.set(cacheKey, data);
		}
	}
};

/**
 * 获取pageState或pageStateSaved中的数据。找不到则返回undefined
 * @param {*} dataType src/functions中的dataType或src/components中的组件名
 * @param {*} key dataType下缓存中的key
 * @param {*} isSaved 是否是pageStateSaved中数据。0：否；1：是。默认0
 */
_.getPageState = function (dataType, key, isSaved = 0) {
	let cacheKey = Number(isSaved) === 0 ? 'pageState' : 'pageStateSaved',
		data = this.get(cacheKey);

	// pageState或pageStateSaved中还没有数据
	if (!data) {
		return undefined;
	}
	// 该模块还没有设置缓存
	if (!has(data, dataType)) {
		return undefined;
	}
	let tempData = data[dataType];
	// 该模块下没有这个key
	if (!has(tempData, key)) {
		return undefined;
	}
	return tempData[key];
};

/**
 * 删除pageState或pageStateSaved中的数据
 * @param {*} dataType src/functions中的dataType或src/components中的组件名
 * @param {*} key dataType下缓存中的key。为''时删除整个dataType
 * @param {*} isSaved 是否是pageStateSaved中数据。0：否；1：是。默认0
 * 返回：如果数据存在，返回true
 */
_.delPageState = function (dataType, key = '', isSaved = 0) {
	if (typeof dataType === 'undefined') throw new Error('Required argument dataType is undefined');
	let cacheKey = Number(isSaved) === 0 ? 'pageState' : 'pageStateSaved',
		data = this.get(cacheKey);

	// pageState或pageStateSaved存在时
	if (has(this.store, cacheKey)) {
		// data中存在dataType
		if (has(data, dataType)) {
			// key为空
			if (key === '') {
				delete data[dataType];
				this.set(cacheKey, data);
				return true;
			}
			let tempData = data[dataType];
			if (has(tempData, key)) {
				delete tempData[key];
				this.set(cacheKey, data);
				return true;
			}
		}
	}
};

/**
 * Export a combined instance and constructor
 */

var creatConstructor = function () {
	var instance = new Cache();
	var constructor = function () {
		return new Cache(arguments[0]);
	};
	constructor.Cache = Cache;
	for (var key in _) {
		if (has(_, key) && typeof _[key] === 'function') {
			constructor[key] = _[key].bind(instance);
		}
	}
	return constructor;
};
var constructor = creatConstructor();

// 给每一个模块添加自己的cache
// const req = require.context('../functions/', true, /main\.js+$/); // 此处会把functions下面所有模块都打包进去，不能使用
// const components = req.keys().map(pathname => {
// 	let match = pathname.match(/\/([\w-]+)\//);
// 	let dirname = match ? match[1] : 'zuo-lin';
// 	dirname = dirname.replace(/(^\w|-\w)/g, str => str[str.length - 1].toUpperCase());
// 	constructor[dirname] = creatConstructor();
// });
module.exports = constructor;
