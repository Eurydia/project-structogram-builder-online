import {
	defineConfig,
	splitVendorChunkPlugin,
} from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
	base: "https://eurydia.github.io/project-nassi-shneiderman-diagram-builder-online/",
	plugins: [
		react(),
		tsconfigPaths(),
		splitVendorChunkPlugin(),
	],
	build: {
		minify: "terser",
		sourcemap: true,
		cssMinify: "esbuild",
		commonjsOptions: {
			strictRequires: true,
		},
		rollupOptions: {
			output: {
				minifyInternalExports: true,
				manualChunks: (id) => {
					if (id.includes("node_module")) {
						return id
							.toString()
							.split("node_modules/")[1]
							.split("/")[0]
							.toString();
					}
				},
			},
		},
	},
});
