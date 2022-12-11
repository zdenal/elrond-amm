import { writable } from 'svelte/store';

export const contractData = writable();

//const storedProvider = typeof localStorage !== 'undefined' && localStorage.getItem('provider');
//export const provider = !!storedProvider ? writable(JSON.parse(storedProvider)) : writable();
export const provider = writable();

//if (typeof localStorage !== 'undefined') {
//provider.subscribe((provider) => {
//localStorage.setItem('provider', JSON.stringify(provider) || '');
//});
//}
