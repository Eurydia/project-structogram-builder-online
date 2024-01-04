import { Box } from "@mui/material";
import { FC, ReactNode } from "react";

type StructogramNodeWrapperProps = {
	children: ReactNode | ReactNode[];
	borderTop?: boolean;
	borderBottom?: boolean;
	borderRight?: boolean;
	borderLeft?: boolean;
};
export const StructogramNodeWrapper: FC<
	StructogramNodeWrapperProps
> = (props) => {
	const {
		children,
		borderTop,
		borderBottom,
		borderLeft,
		borderRight,
	} = props;
	return (
		<Box
			height="100%"
			sx={{
				borderColor: "inherit",
				backgroundColor: "inherit",
				borderStyle: "solid",
				borderLeftWidth: borderLeft
					? "inherit"
					: 0,
				borderTopWidth: borderTop ? "inherit" : 0,
				borderBottomWidth: borderBottom
					? "inherit"
					: 0,
				borderRightWidth: borderRight
					? "inherit"
					: 0,
			}}
		>
			{children}
		</Box>
	);
};
