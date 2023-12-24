import { Fragment, FC } from "react";
import {
	CssBaseline,
	ThemeProvider,
	alpha,
	createTheme,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { SnackbarProvider } from "notistack";

import { HomePage } from "routes/HomePage";

import "katex/dist/katex.min.css";

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
					<HomePage />
				</SnackbarProvider>
			</ThemeProvider>
		</Fragment>
	);
};
