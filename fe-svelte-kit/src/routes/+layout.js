import { contractData, provider, myHoldings } from '../stores.js';
import { init, getMyHoldings } from '../contract';

/** @type {import('./$types').PageLoad} */
export async function load() {
	const _contractData = await init();
	contractData.set(_contractData);

	provider.subscribe((value) => {
		if (value?.account) {
			getMyHoldings({
				address: value.account.address,
				..._contractData
			}).then((res) => {
				myHoldings.set(res);
			});
		}
	});

	return { contractData: _contractData };
}
