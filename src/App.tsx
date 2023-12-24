import { Fragment, FC } from "react";
import {
	CssBaseline,
	ThemeProvider,
	createTheme,
} from "@mui/material";
import { SnackbarProvider } from "notistack";
import { Home } from "routes/Home";

import "katex/dist/katex.min.css";

const themeDark = createTheme({
	palette: { mode: "dark" },
});

// const globalStyles = <GlobalStyles />;

export const App: FC = () => {
	return (
		<Fragment>
			<CssBaseline />
			<ThemeProvider theme={themeDark}>
				{/* {globalStyles} */}
				<SnackbarProvider>
					<Home />
				</SnackbarProvider>
			</ThemeProvider>
		</Fragment>
	);
};
