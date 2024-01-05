import { Fragment, FC } from "react";
import {
	CssBaseline,
	ThemeProvider,
	createTheme,
} from "@mui/material";

import { SnackbarProvider } from "notistack";

import { EditorPage } from "routes/EditorPage";

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
					<EditorPage />
				</SnackbarProvider>
			</ThemeProvider>
		</Fragment>
	);
};
