import { FC } from "react";
import {
	Button,
	ButtonProps,
	Tooltip,
} from "@mui/material";

/**
 * This component is a button that adapts to the screen size.
 * When the screen size is small, the label collapses down to an icon.
 */
type AdaptiveButtonProps = ButtonProps & {
	collapsed: boolean;
};
export const AdaptiveButton: FC<
	AdaptiveButtonProps
> = (props) => {
	const { collapsed, ...rest } = props;

	if (collapsed) {
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
