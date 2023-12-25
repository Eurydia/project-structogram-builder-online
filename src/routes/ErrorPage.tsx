import { FC } from "react";
import {
	Container,
	Stack,
	Typography,
} from "@mui/material";
import { useRouteError } from "react-router-dom";

export const ErrorPage: FC = () => {
	const error = useRouteError() as {
		statusText: string;
		status: string;
	};

	return (
		<Container maxWidth="lg">
			<Stack
				alignItems="center"
				justifyContent="center"
			>
				<Typography component="h1">
					{error.status}
				</Typography>
				<Typography paragraph>
					{error.statusText}
				</Typography>
			</Stack>
		</Container>
	);
};
