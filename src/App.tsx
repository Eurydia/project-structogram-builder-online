import {
	useCallback,
	useState,
	Fragment,
	FC,
} from "react";
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

import { Navigation } from "components/Navigation";

import { PageHome } from "pages/PageHome";
import { PageDocumentation } from "pages/PageDocumentation";

const themeLight = createTheme({
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

const globalStyles = (
	<GlobalStyles
		styles={{
			body: {
				backgroundColor:
					themeLight.palette.primary.main,
				color: themeLight.palette.text.primary,
			},
		}}
	/>
);

export const App: FC = () => {
	const [page, setPage] = useState<number>(0);

	const onPageChange = useCallback(
		(page: number) => {
			setPage(page);
		},
		[],
	);

	return (
		<Fragment>
			<CssBaseline />
			<ThemeProvider theme={themeLight}>
				{globalStyles}
				<Navigation onPageChange={onPageChange} />
				<Container
					maxWidth="xl"
					component="main"
				>
					{page === 0 && <PageHome />}
					{page === 1 && <PageDocumentation />}
				</Container>
			</ThemeProvider>
		</Fragment>
	);
};
