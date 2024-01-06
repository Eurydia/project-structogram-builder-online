import { ReactNode } from "react";
import {
	Box,
	SxProps,
	Typography,
} from "@mui/material";

import { Node, NodeKind } from "interpreter";
import { StructogramNode } from "renderer/StructogramNode";

export const renderer = (
	nodes: Node[],
	id: string,
	boxProps: SxProps,
): ReactNode => {
	let component: ReactNode | ReactNode[] = (
		<Typography
			fontFamily="inherit"
			fontStyle="italic"
		>
			Nothing to display.
		</Typography>
	);

	const filteredNodes = nodes.filter(
		(node) =>
			node.kind !== NodeKind.PROCESS ||
			node.body
				.map((token) => token.text)
				.join("")
				.trim().length > 0,
	);

	if (filteredNodes.length > 0) {
		component = filteredNodes.map(
			(node, index) => (
				<StructogramNode
					key={index}
					node={node}
					borderLeft
					borderTop
					borderRight
					borderBottom={
						index === filteredNodes.length - 1
					}
				/>
			),
		);
	}

	return (
		<Box sx={boxProps}>
			<Box
				id={id}
				maxWidth="640px"
				fontFamily="Fira Code"
				sx={{
					wordBreak: "break-all",
					fontVariantLigatures: "contextual",
					userSelect: "none",
				}}
			>
				{component}
			</Box>
		</Box>
	);
};
