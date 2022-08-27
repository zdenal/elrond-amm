import { sveltekit } from '@sveltejs/kit/vite';
import NodeModulesPolyfills from '@esbuild-plugins/node-modules-polyfill';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

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
	}
};

export default config;
