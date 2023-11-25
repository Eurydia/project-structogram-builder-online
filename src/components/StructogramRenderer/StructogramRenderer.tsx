import { FC } from "react";

import { ASTNode } from "ast/parser";

import { StructogramComponent } from "./StructogramComponent";
import { Box, Typography } from "@mui/material";

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
				fontStyle="italic"
				component="p"
			>
				Start typing to see the preview.
			</Typography>
		);
	}

	return (
		<Box padding={2}>
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
