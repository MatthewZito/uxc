import { resolve } from 'path';
import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';
import react from '@vitejs/plugin-react';

const r = (dir) => resolve(__dirname, dir);

export default defineConfig({
	base: '/',

	server: {
		open: true
	},

	plugins: [
		eslintPlugin(),
		react()
	],

	resolve: {
		alias: {
			'@': r('./src'),
			'@pkg': r('./package.json')
		}
	},

	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '@import \'@/styles/index\';'
			}
		}
	},

	build: {
		// < limit to base64 string
		assetsInlineLimit: 10000
	}
});