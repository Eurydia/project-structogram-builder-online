import {} from "@emotion/react";
import {
	AppBar,
	Toolbar,
	Typography,
	useTheme,
} from "@mui/material";
import { FC } from "react";

type StyledAppBarProps = {
	// Props type definition goes here
};
export const StyledAppBar: FC<
	StyledAppBarProps
> = () => {
	const theme = useTheme();

	return (
		<AppBar
			position="static"
			sx={{
				backgroundColor:
					theme.palette.background.paper,
			}}
		>
			<Toolbar variant="dense">
				<Typography>
					<a
						hrefLang="en"
						target="_blank"
						href="https://en.wikipedia.org/wiki/Nassi%E2%80%93Shneiderman_diagram"
					>
						Structogram
					</a>{" "}
					Builder
				</Typography>
			</Toolbar>
		</AppBar>
	);
};
