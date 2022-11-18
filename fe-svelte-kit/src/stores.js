import { writable } from 'svelte/store';

export const contractData = writable();

const storedProvider = typeof localStorage !== 'undefined' && localStorage.getItem('provider');
console.log(storedProvider);
export const provider = writable(JSON.parse(storedProvider));

if (typeof localStorage !== 'undefined') {
	provider.subscribe((provider) => {
		localStorage.setItem('provider', JSON.stringify(provider) || '');
	});
}
