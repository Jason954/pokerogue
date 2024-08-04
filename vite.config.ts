import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { minifyJsonPlugin } from "./src/plugins/vite/vite-minify-json-plugin";

export const defaultConfig = {
	plugins: [
		tsconfigPaths() as any,
		minifyJsonPlugin(["images", "battle-anims"], true)
	],
	server: {
		host: '0.0.0.0',
		port: 8000,
		proxy: {
			"/api": {
				target: "http://"+process.env.VITE_SERVER_URL+":"+process.env.VITE_API_PORT,
				// target: process.env.VITE_SERVER_URL,
				changeOrigin: true,
				secure: false,
				rewrite: path => path.replace(/^\/api/, '')
			},
		},
	},
	clearScreen: false,
	build: {
		minify: 'esbuild' as const,
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
	}
};


export default defineConfig(({mode}) => {
	const envPort = Number(loadEnv(mode, process.cwd()).VITE_PORT);

	return ({
		...defaultConfig,
		esbuild: {
			pure: mode === 'production' ? ['console.log'] : [],
			keepNames: true,
		},
		server: {
			port: !isNaN(envPort) ? envPort : 8000,
		}
	});
});
