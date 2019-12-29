import localStorage from './localStorage';

export default (key) => {
	const basicInfo = localStorage.read('basic_info');
	if (typeof basicInfo !== 'string') { return {}; }
	return JSON.parse(basicInfo)[key];
};
