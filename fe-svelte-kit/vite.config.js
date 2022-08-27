import { sveltekit } from '@sveltejs/kit/vite';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import nodePolyfills from 'rollup-plugin-node-polyfills';

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
	plugins: [sveltekit()],
	define: {
		global: {},
		'process.env': {}
	},
	optimizeDeps: {
		esbuildOptions: {
			plugins: [NodeGlobalsPolyfillPlugin({ buffer: true, fs: true })],
			target: 'es2020'
		}
	},
	build: {
		target: 'es2020',
		rollupOptions: {
			plugins: [nodePolyfills()]
		}
	},
	alias: {
		// This Rollup aliases are extracted from @esbuild-plugins/node-modules-polyfill,
		// see https://github.com/remorses/esbuild-plugins/blob/master/node-modules-polyfill/src/polyfills.ts
		// process and buffer are excluded because already managed
		// by node-globals-polyfill
		//crypto: 'crypto-browserify',
		//fs: 'rollup-plugin-node-polyfills/polyfills/fs'
	}
	//build: {
	//rollupOptions: {
	//external: ['fs/promises']
	//}
	//}
};

export default config;
