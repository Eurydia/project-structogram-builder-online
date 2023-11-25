import { Fragment, FC } from "react";
import {
	Container,
	CssBaseline,
	ThemeProvider,
	createTheme,
	GlobalStyles,
} from "@mui/material";
import {
	blue,
	grey,
	pink,
} from "@mui/material/colors";

import { PageHome } from "pages/PageHome";

const themeLightComponent = createTheme({
	components: {
		MuiTypography: {
			styleOverrides: {
				root: ({ ownerState }) => {
					if (
						ownerState.fontFamily !== "monospace"
					) {
						return;
					}
					return {
						fontFamily: "Fira Code",
					};
				},
			},
		},
	},
});

const themeLightPalette = createTheme({
	palette: {
		mode: "light",
		primary: {
			main: blue[200],
		},
		secondary: {
			main: pink[300],
		},
		text: {
			primary: grey[800],
		},
	},
});

const themeLight = createTheme(
	themeLightComponent,
	themeLightPalette,
);

const globalStyles = (
	<GlobalStyles
		styles={{
			body: {
				backgroundColor:
					themeLightPalette.palette.primary.main,
				color:
					themeLightPalette.palette.text.primary,
			},
		}}
	/>
);

export const App: FC = () => {
	return (
		<Fragment>
			<CssBaseline />
			<ThemeProvider theme={themeLight}>
				{globalStyles}
				<Container
					maxWidth="xl"
					component="main"
				>
					<PageHome />
				</Container>
			</ThemeProvider>
		</Fragment>
	);
};
