import {
	CssBaseline,
	ThemeProvider,
	createTheme,
} from "@mui/material";
import { LiveEditor } from "App/components/LiveEditor";
import { SnackbarProvider } from "notistack";
import { FC, Fragment } from "react";

const themeDark = createTheme({
	palette: {
		mode: "dark",
	},
});

/**
 * The main application component.
 * It resets the CSS and define the "Theme" and the "Snackbar" provider.
 *
 * The "LiveEditor" component is the main component of the application, and this component is a wrapper for it.
 */
export const App: FC = () => {
	return (
		<Fragment>
			<CssBaseline />
			<ThemeProvider theme={themeDark}>
				<SnackbarProvider
					preventDuplicate
					autoHideDuration={2000}
					anchorOrigin={{
						vertical: "top",
						horizontal: "center",
					}}
				>
					<LiveEditor />
				</SnackbarProvider>
			</ThemeProvider>
		</Fragment>
	);
};
