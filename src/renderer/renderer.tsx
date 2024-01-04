import { ReactNode } from "react";
import {
	Box,
	SxProps,
	Typography,
} from "@mui/material";

import {
	ASTNode,
	ASTNodeKind,
} from "interpreter/parser";
import { StructogramNode } from "renderer/components/StructogramNode";

export const renderer = (
	nodes: ASTNode[],
	id: string,
	sx: SxProps,
) => {
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
			node.kind !== ASTNodeKind.PROCESS ||
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
		<Box sx={sx}>
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
