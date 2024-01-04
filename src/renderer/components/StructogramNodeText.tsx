import { FC } from "react";
import {
	TypographyProps,
	Typography,
} from "@mui/material";

type StructogramComponentTextProps =
	TypographyProps & {
		children?: string;
	};
export const StructogramComponentText: FC<
	StructogramComponentTextProps
> = (props) => {
	const { children, ...rest } = props;

	return (
		<Typography
			fontFamily="inherit"
			fontWeight="inherit"
			padding={1}
			paddingLeft={2}
			{...rest}
		>
			{children ?? "..."}
		</Typography>
	);
};
