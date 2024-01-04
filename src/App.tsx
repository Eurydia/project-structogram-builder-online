import { Fragment, FC } from "react";
import {
	CssBaseline,
	ThemeProvider,
	alpha,
	createTheme,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { SnackbarProvider } from "notistack";

import { EditorPage } from "routes/EditorPage";

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
