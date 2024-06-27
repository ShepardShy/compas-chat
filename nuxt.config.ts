import path from "path";
import svgLoader from "vite-svg-loader";
import { createResolver } from "@nuxt/kit";

const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
	modules: [
		"@pinia/nuxt",
		// '@nuxtjs/eslint-module',
		"@vueuse/nuxt",
		"@vee-validate/nuxt",
	],
	css: [resolve("./assets/styles/main.scss")],
	vite: {
		plugins: [svgLoader({})],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
	},
	typescript: {
		typeCheck: false,
		strict: false,
	},
});
