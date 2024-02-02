import { Fragment, FC } from "react";
import {
	CssBaseline,
	ThemeProvider,
	createTheme,
} from "@mui/material";

import { SnackbarProvider } from "notistack";

import { LiveEditor } from "App/components/LiveEditor/LiveEditor";

const themeDark = createTheme({
	palette: {
		mode: "dark",
	},
});

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