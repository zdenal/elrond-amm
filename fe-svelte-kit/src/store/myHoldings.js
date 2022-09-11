import { writable } from 'svelte/store';
import { getMyHoldings } from '../contract';

export const myHoldings = writable();

export function load(provider, contractData) {
	getMyHoldings({
		address: provider.account.address,
		...contractData
	}).then((res) => {
		myHoldings.set(res);
	});
}
