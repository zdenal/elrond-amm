import { TransactionWatcher, TransactionHash } from '@elrondnetwork/erdjs';

export const PRECISION = 1000000;
export const FEE_PRECISION = 1000;
export const TOKEN_PRECISION = 6;

export function toDecimal(number) {
	return (number / PRECISION).toFixed(2);
}

export function withTokenPrecision(number) {
	return number.toFixed(TOKEN_PRECISION);
}

export function feeInPerc(fee) {
	return fee / FEE_PRECISION;
}

export function present(value) {
	const res = !!value ? value : '...';
	return (res / 10 ** TOKEN_PRECISION).toFixed(TOKEN_PRECISION);
}

export function toWei(value) {
	return Math.floor(value * 10 ** TOKEN_PRECISION);
}

export function capitilize(str) {
	return str[0].toUpperCase() + str.substring(1);
}

export function watchSendTx({ txHash, contractData, onSuccess, addNotification }) {
	addNotification({ text: 'Transaction send', position: 'top-right', removeAfter: 2000 });

	let watcher = new TransactionWatcher(contractData.networkProvider);
	watcher.awaitCompleted({ getHash: () => new TransactionHash(txHash) }).then((res) => {
		console.log('Tx watcher result', res);
		if (res.contractResults.items.length > 0) {
			onSuccess();
			addNotification({
				text: 'Transaction success',
				position: 'top-right',
				type: 'success',
				removeAfter: 2000
			});
		} else {
			addNotification({
				text: 'Transaction failed',
				position: 'top-right',
				type: 'error',
				removeAfter: 2000
			});
		}
	});
}
