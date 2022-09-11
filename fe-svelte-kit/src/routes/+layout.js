import { contractData, provider } from '../stores.js';
import { init } from '../contract';
import { load as loadHoldings } from '../store/myHoldings';

/** @type {import('./$types').PageLoad} */
export async function load() {
	const _contractData = await init();
	contractData.set(_contractData);

	provider.subscribe((value) => {
		if (value?.account) {
			loadHoldings(value, _contractData);
		}
	});

	return { contractData: _contractData };
}
