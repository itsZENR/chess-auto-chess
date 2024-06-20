const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');
const { VuetifyPlugin } = require('webpack-plugin-vuetify');

module.exports = defineConfig({
	transpileDependencies: ['vuetify'],

	devServer: {
		port: 8080,
	},
	configureWebpack: {
		plugins: [
			new webpack.DefinePlugin({
				__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
			}),
		],
	},
	pluginOptions: {
		vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		},
		plugins: [
			new VuetifyPlugin({
				autoImport: true,
				styles: { configFile: 'src/css/main.module.css' },
			}),
		],
	},
});
