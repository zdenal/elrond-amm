import { TransactionWatcher, TransactionHash } from '@elrondnetwork/erdjs';

export const PRECISION = 1000000;

export function toDecimal(number) {
	return (number / PRECISION).toFixed(2);
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
