import { Fragment, FC } from "react";
import {
	RouterProvider,
	createBrowserRouter,
} from "react-router-dom";
import {
	CssBaseline,
	ThemeProvider,
	alpha,
	createTheme,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { SnackbarProvider } from "notistack";

import { EditorPage } from "routes/EditorPage";
import { ErrorPage } from "routes/ErrorPage";

import "katex/dist/katex.min.css";
import { PreviewPage } from "routes/PreviewPage";

const router = createBrowserRouter(
	[
		{
			path: "/",
			element: <EditorPage />,
			errorElement: <ErrorPage />,
		},
		{
			path: "editor",
			element: <EditorPage />,
			errorElement: <ErrorPage />,
			children: [
				{
					path: ":content",
					element: <PreviewPage />,
					errorElement: <ErrorPage />,
				},
			],
		},
		{
			path: "preview",
			element: <PreviewPage />,
			errorElement: <ErrorPage />,
			children: [
				{
					path: ":content",
					element: <PreviewPage />,
					errorElement: <ErrorPage />,
				},
			],
		},
	],
	{
		basename:
			"/project-nassi-shneiderman-diagram-builder-online",
	},
);

const themeDark = createTheme({
	palette: {
		mode: "dark",
		text: {
			primary: alpha(grey[300], 0.87),
			secondary: alpha(grey[300], 0.6),
		},
	},
});

export const App: FC = () => {
	return (
		<Fragment>
			<CssBaseline />
			<ThemeProvider theme={themeDark}>
				<SnackbarProvider
					autoHideDuration={3000}
					anchorOrigin={{
						vertical: "top",
						horizontal: "center",
					}}
				>
					<RouterProvider router={router} />
				</SnackbarProvider>
			</ThemeProvider>
		</Fragment>
	);
};
