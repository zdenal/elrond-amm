export const PRECISION = 1000000;

export function toDecimal(number) {
	return (number / PRECISION).toFixed(2);
}

export function capitilize(str) {
	return str[0].toUpperCase() + str.substring(1);
}
