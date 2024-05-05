import {
	CssBaseline,
	ThemeProvider,
} from "@mui/material";
import { SnackbarProvider } from "notistack";
import { FC, Fragment } from "react";
import { LiveEditor } from "~components/LiveEditor";
import { themeDark } from "./theme";

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
