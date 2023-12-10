import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
	base: "https://eurydia.github.io/nassi-shneiderman-diagram-builder-online/",
	plugins: [react(), tsconfigPaths()],
	build: {
		emptyOutDir: true,
		manifest: true,
		minify: true,
		polyfillModulePreload: false,
		rollupOptions: {
			output: {
				chunkFileNames: "chunk-[name].[hash].js",
				entryFileNames: "entry-[name].[hash].js",
				inlineDynamicImports: false,
				sourcemap: true,
			},
		},
		sourcemap: true,
	},
});
