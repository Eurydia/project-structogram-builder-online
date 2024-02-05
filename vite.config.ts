import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
	base: "https://eurydia.github.io/project-nassi-shneiderman-diagram-builder-online/",
	plugins: [react(), tsconfigPaths()],
	build: {
		sourcemap: true,
		manifest: true,
		minify: "terser",
		cssMinify: "esbuild",
		rollupOptions: {
			output: {
				manualChunks: (id) => {
					if (id.search("node_modules") >= 0) {
						const vendors = [
							"@mui/material",
							"@mui/icons-material",
							"notistack",
						];
						for (const vendor of vendors) {
							if (id.search(vendor) >= 0) {
								return encodeURIComponent(
									`vendor-${vendor}`,
								);
							}
						}

						return "vendor";
					}
				},
			},
		},
	},
});
