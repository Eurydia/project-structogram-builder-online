import { FC, Fragment } from "react";
import {
	Button,
	ButtonProps,
} from "@mui/material";

type AdaptiveButtonProps = ButtonProps & {
	collapse: boolean;
};
export const AdaptiveButton: FC<
	AdaptiveButtonProps
> = (props) => {
	const { collapse, ...rest } = props;

	return (
		<Button
			{...rest}
			startIcon={
				collapse ? undefined : rest.startIcon
			}
			endIcon={
				collapse ? undefined : rest.endIcon
			}
		>
			{collapse ? (
				<Fragment>
					{rest.startIcon}
					{rest.endIcon}
				</Fragment>
			) : (
				<Fragment>{rest.children}</Fragment>
			)}
		</Button>
	);
};
