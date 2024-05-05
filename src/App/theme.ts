import {
	alpha,
	createTheme,
} from "@mui/material";

export const themeDark = createTheme({
	palette: {
		primary: {
			main: "#e1cdfe",
		},
		text: {
			primary: alpha("#f00", 0.9),
		},
		background: {
			paper: "#2B2828",
			default: "#2B2828",
		},
	},
});
