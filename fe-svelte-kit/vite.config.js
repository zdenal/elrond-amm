import { sveltekit } from '@sveltejs/kit/vite';
//import nodePolyfills from 'vite-plugin-node-stdlib-browser';
import { NgmiPolyfill } from 'vite-plugin-ngmi-polyfill';

// *******************************************************************************
// *******************************************************************************
// FOR SOME ANOTHER ISSUE WITH NODE MODULE CHECK THIS:
// https://stackoverflow.com/questions/69286329/polyfill-node-os-module-with-vite-rollup-js
// *******************************************************************************
// *******************************************************************************

// Config is based on metaplex + vite example from:
// https://github.com/metaplex-foundation/js-examples/tree/main/getting-started-vite

// es2020 Needed for BigNumbers
// See https://github.com/sveltejs/kit/issues/859

/** @type {import('vite').UserConfig} */
const config = {
	// !!!! FOR PRODUCTION BUILD USE:
	plugins: [sveltekit(), NgmiPolyfill()],
	// !!!! FOR LOCAL DEV USE:
	//plugins: [sveltekit(), nodePolyfills()],
	define: {
		global: '({})',
		'process.env': {}
	},
	server: {
		fs: { allow: ['contract'] }
	}
};

export default config;
