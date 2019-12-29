const gotoModule = function ({dataType, success, error}) {
	try {
		const activeModules = JSON.parse(localStorage.getItem('active_modules'));
		if (activeModules.findIndex((value) => value === dataType) === -1) {
			if (error)error();
			return false;
		}
		if (success)success();
		return true;
	} catch (msg) {
		if (error)error(msg);
		return false;
	}
};

export default gotoModule;
