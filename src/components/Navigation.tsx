import { useCallback, FC } from "react";
import { HomeRounded } from "@mui/icons-material";
import {
	AppBar,
	Button,
	IconButton,
	Toolbar,
	Tooltip,
	useTheme,
} from "@mui/material";

type NavigationProps = {
	onPageChange: (page: number) => void;
};
export const Navigation: FC<NavigationProps> = (
	props,
) => {
	const { onPageChange: onChange } = props;
	const theme = useTheme();

	const handleHomeClick = useCallback(() => {
		onChange(0);
	}, [onChange]);

	const handleHelpClick = useCallback(() => {
		onChange(1);
	}, [onChange]);

	return (
		<AppBar
			position="static"
			sx={{
				backgroundColor:
					theme.palette.background.paper,
			}}
		>
			<Toolbar variant="regular">
				<Tooltip title="Home">
					<IconButton onClick={handleHomeClick}>
						<HomeRounded
							htmlColor={
								theme.palette.text.primary
							}
						/>
					</IconButton>
				</Tooltip>
				<Button
					variant="text"
					onClick={handleHelpClick}
					sx={{
						color: theme.palette.text.primary,
					}}
				>
					Documentation
				</Button>
			</Toolbar>
		</AppBar>
	);
};
