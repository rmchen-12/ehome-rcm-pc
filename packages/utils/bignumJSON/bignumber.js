
// wraps a large number, does not support arithmetic
import inherits from 'inherits';

function BigNumber (number) {
	this.numberStr = number.toString();

	// not a number
	if (isNaN(parseFloat(this.numberStr)) === true ||
    isFinite(this.numberStr) === false) {
		throw new Error(number + ' is not a number');
	}
}
inherits(BigNumber, Object);

BigNumber.prototype.toString = function () {
	return this.numberStr;
};

export default BigNumber;
