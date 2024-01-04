import { FC } from "react";
import {
	TypographyProps,
	Typography,
} from "@mui/material";

type StructogramComponentTextProps =
	TypographyProps & {
		text?: string;
	};
export const StructogramComponentText: FC<
	StructogramComponentTextProps
> = (props) => {
	const { text, ...rest } = props;
	return (
		<Typography
			fontFamily="inherit"
			fontWeight="inherit"
			padding={1}
			paddingLeft={2}
			{...rest}
		>
			{text ?? "..."}
		</Typography>
	);
};
