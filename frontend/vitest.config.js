import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "jsdom",
		globals: true,
		env: {
			VITE_API_URL: "http://localhost:3000/api",
		},
	},
});
