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
> = (props) => {
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
				<Typography>Photos</Typography>
			</Toolbar>
		</AppBar>
	);
};
