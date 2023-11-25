import { FC } from "react";
import {
	Box,
	Typography,
	useTheme,
} from "@mui/material";

export const PageDocumentation: FC = () => {
	const theme = useTheme();

	return (
		<Box
			padding={4}
			component="section"
		>
			<Typography
				borderRadius={4}
				bgcolor={theme.palette.background.default}
				padding={2}
				fontWeight={700}
				component="h1"
				variant="h4"
				marginBottom={2}
			>
				Documentation
			</Typography>
		</Box>
	);
};
