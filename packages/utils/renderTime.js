import moment from 'moment';
/**
 * @desc 得到传入的时间距当前时间的正确描述 用于工作汇报，审批
 * @param {Date} time 时间戳
 * @return {String}
 */
const renderTime = (time) => {
	let currentDate = new Date();
	let minute = 60 * 1000;
	let hour = 60 * 60 * 1000;
	let day = 24 * 60 * 60 * 1000;
	let twoDay = 2 * 24 * 60 * 60 * 1000;
	let weekDay = 7 * 24 * 60 * 60 * 1000;
	let year = 365 * 24 * 60 * 60 * 1000;
	let leftTime = moment(time).format('H') * hour + moment(time).format('mm') * minute;
	let result = Math.abs(currentDate.valueOf() - time);
	result = result > hour ? result + leftTime : result;
	let shouldShowDate;
	if (result < minute) {
		shouldShowDate = '刚刚';
	} else if (result > minute && result < hour) {
		shouldShowDate = moment(time).startOf('minute').fromNow();
	} else if (result > hour && result < day) {
		shouldShowDate = moment(time).format('HH:mm');
	} else if (result > day && result < twoDay) {
		shouldShowDate = moment(time).format('昨日 HH:mm');
	} else if (result > twoDay && result < weekDay) {
		shouldShowDate = moment(time).format('dddd HH:mm');
	} else if (result > weekDay && result < year) {
		shouldShowDate = moment(time).format('MM-DD HH:mm');
	} else {
		shouldShowDate = moment(time).format('YYYY-MM-DD');
	}
	return shouldShowDate;
};

export default renderTime;
