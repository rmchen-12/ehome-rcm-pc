import moment from 'moment';

/**
 * @desc 得到传入的时间距当前时间的正确描述 用于日程提醒
 * @param {Date} time 时间戳
 * @return {String}
 */
const renderTime = (time) => {
	let currentDate = new Date();
	let minute = 60 * 1000;
	let hour = 60 * 60 * 1000;
	let day = 24 * 60 * 60 * 1000;
	let weekDay = 7 * 24 * 60 * 60 * 1000;

	let formatDate = moment().format('YYYY-MM-DD');
	const weekOfday = moment(formatDate).format('E');//计算是当周第几天
	const thisMondayValue = moment(formatDate).subtract(parseInt(weekOfday, 10) - 1, 'days').valueOf(); //今周一
	const thisSundayValue = moment(formatDate).add(7 - parseInt(weekOfday, 10), 'days').valueOf(); // 今周日
	const lastMondayValue = thisMondayValue - weekDay; //上周一
	const lastSundayValue = thisSundayValue - weekDay; // 上周日
	const nextMondayValue = thisMondayValue + weekDay; //下周一
	const nextSundayValue = thisSundayValue + weekDay; //下周日
	const thisYearFirst = moment(`${moment().format('YYYY')}-01-01`).valueOf(); //今年1号的值
	const thisYearLast = moment(`${moment().format('YYYY')}-12-31`).valueOf(); //今年12月31号的值

	let leftTime = moment().format('H') * hour + moment().format('mm') * minute + moment().format('ss') * 1000 + 1000; // 后面加1000毫秒是因为有误差
	let relativeTime = currentDate.valueOf() - time;
	let result = Math.abs(relativeTime);
	result = relativeTime < hour ? result + leftTime : result;
	let shouldShowDate;
	if (result < day) {
		shouldShowDate = '今天';
	} else if (relativeTime < 0 && result > day && result < 2 * day) {
		shouldShowDate = '明天';
	} else if (relativeTime < 0 && result > 2 * day && result < 3 * day) {
		shouldShowDate = '后天';
	} else if (relativeTime > 0 && result > day && result < 2 * day) {
		shouldShowDate = '昨天';
	} else if (relativeTime > 0 && result > 2 * day && result < 3 * day) {
		shouldShowDate = '前天';
	} else if (result > 3 * day && time >= thisMondayValue && time <= thisSundayValue) {
		shouldShowDate = `本周${moment(time).format('dd')}`;
	} else if (relativeTime >= 0 && result > 3 * day && time >= lastMondayValue && time <= lastSundayValue) {
		shouldShowDate = `上周${moment(time).format('dd')}`;
	} else if (relativeTime < 0 && result > 3 * day && time >= nextMondayValue && time <= nextSundayValue) {
		shouldShowDate = `下周${moment(time).format('dd')}`;
	} else if (time >= thisYearFirst && time < lastMondayValue) {
		shouldShowDate = moment(time).format('MM-DD');
	} else if (time < thisYearFirst) {
		shouldShowDate = moment(time).format('YYYY-MM-DD');
	} else if (time > nextSundayValue && time <= thisYearLast) {
		shouldShowDate = moment(time).format('MM-DD');
	} else {
		shouldShowDate = moment(time).format('YYYY-MM-DD');
	}
	return shouldShowDate;
};

export default renderTime;
