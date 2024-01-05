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
					if (id.includes("node_modules")) {
						if (id.includes("@mui/material")) {
							return "vendor_mui";
						}
						if (
							id.includes("@mui/icons-material")
						) {
							return "vendor_mui_icon";
						}

						if (id.includes("notistack")) {
							return "vendor_notistack";
						}

						return "vendor";
					}
				},
			},
		},
	},
});
