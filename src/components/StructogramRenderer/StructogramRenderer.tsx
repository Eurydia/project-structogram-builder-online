import { FC } from "react";

import {
	Box,
	Typography,
	useTheme,
} from "@mui/material";

import { ASTNode } from "ast/parser";

import { StructogramComponent } from "./StructogramComponent";

type StructogramRendererProps = {
	nodes: ASTNode[];
};
export const StructogramRenderer: FC<
	StructogramRendererProps
> = (props) => {
	const { nodes } = props;
	const theme = useTheme();

	return (
		<Box
			borderRadius={4}
			padding={4}
			bgcolor={theme.palette.background.paper}
		>
			{nodes.length > 0 ? (
				nodes.map((node, index) => (
					<StructogramComponent
						key={index}
						node={node}
						borderLeft
						borderTop
						borderRight
						borderBottom={
							index === nodes.length - 1
						}
					/>
				))
			) : (
				<Typography fontStyle="italic">
					Start typing to see the preview.
				</Typography>
			)}
		</Box>
	);
};
