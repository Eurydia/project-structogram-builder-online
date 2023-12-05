import { FC } from "react";
import { Box, Typography } from "@mui/material";

import { ASTNode } from "ast/parser";
import { StructogramComponent } from "./StructogramComponent";

type StructogramRendererProps = {
	nodes: ASTNode[];
};
export const StructogramRenderer: FC<
	StructogramRendererProps
> = (props) => {
	const { nodes } = props;

	if (nodes.length === 0) {
		return (
			<Typography
				fontFamily="inherit"
				fontStyle="italic"
				component="p"
			>
				Start typing to see the preview.
			</Typography>
		);
	}

	return (
		<Box fontFamily="Consolas">
			{nodes.map((node, index) => (
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
			))}
		</Box>
	);
};
