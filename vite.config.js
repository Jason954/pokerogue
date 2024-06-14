import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
// import fs from 'vite-plugin-fs';

export default defineConfig(({ mode }) => {
	process.env = {...process.env, ...loadEnv(mode, process.cwd())};


	return {
		plugins: [tsconfigPaths()],
		server: {
			host: '0.0.0.0',
			port: 8000,
			proxy: {
				"/api": {
					target: "http://"+process.env.VITE_API_BASE_URL+":"+process.env.VITE_API_PORT,
					changeOrigin: true,
					secure: false,
					rewrite: path => path.replace(/^\/api/, '')
				},
			},
		},
		clearScreen: false,
		build: {
			minify: 'esbuild',
			sourcemap: false,
		},
		rollupOptions: {
			onwarn(warning, warn) {
				// Suppress "Module level directives cause errors when bundled" warnings
				if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
				  return;
				}
				warn(warning);
			},
		},
		resolve: {
			alias: {
				"#enums": resolve('./src/enums')
			}
		},
		esbuild: {
			pure: mode === 'production' ? [ 'console.log' ] : [],
			keepNames: true,
		},
	}
})
