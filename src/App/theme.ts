import {
	alpha,
	createTheme,
} from "@mui/material";

export const themeDark = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: "#e1cdfe",
		},
		text: {
			primary: alpha("#fff", 0.9),
		},
		background: {
			paper: "#2B2828",
			default: "#2B2828",
		},
	},
});
