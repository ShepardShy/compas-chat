import path from "path";
import svgLoader from "vite-svg-loader";
import { createResolver } from "@nuxt/kit";
import { fileURLToPath } from "url";

const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
	modules: [
		"@pinia/nuxt",
		// '@nuxtjs/eslint-module',
		"@vueuse/nuxt",
		"@vee-validate/nuxt",
	],

	alias: {
		// "~": "./",
	},

	css: [resolve("./assets/styles/main.scss")],

	vite: {
		plugins: [svgLoader({})],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./"),
				"~": path.resolve(__dirname, "./"),
			},
		},
	},

	app: {
		head: {
			viewport: "width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1, user-scalable=0, interactive-widget=resizes-content",
		},
	},

	typescript: {
		typeCheck: false,
		strict: false,
	},

	compatibilityDate: "2024-07-04",

	devtools: {
		enabled: true,
	},
});
