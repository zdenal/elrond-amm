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
			plugins: [NodeGlobalsPolyfillPlugin({ buffer: true })],
			target: 'es2020'
		}
	},
	build: {
		target: 'es2020',
		rollupOptions: {
			plugins: [nodePolyfills()]
		}
	},
	server: {
		fs: { allow: ['contract'] }
	}
};

export default config;
