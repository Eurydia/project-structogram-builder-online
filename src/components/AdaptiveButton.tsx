import { FC } from "react";
import {
	Button,
	ButtonProps,
	Tooltip,
} from "@mui/material";

type AdaptiveButtonProps = ButtonProps & {
	collapse: boolean;
};
export const AdaptiveButton: FC<
	AdaptiveButtonProps
> = (props) => {
	const { collapse, ...rest } = props;

	if (collapse) {
		return (
			<Tooltip title={rest.children}>
				<Button
					{...rest}
					startIcon={undefined}
					endIcon={undefined}
				>
					{rest.startIcon}
					{rest.endIcon}
				</Button>
			</Tooltip>
		);
	}

	return (
		<Button
			{...rest}
			startIcon={rest.startIcon}
			endIcon={rest.endIcon}
		>
			{rest.children}
		</Button>
	);
};
