import { FC } from "react";
import {
	Box,
	SxProps,
	Typography,
} from "@mui/material";

import { ASTNode } from "ast/parser";
import { StructogramComponent } from "./StructogramComponent";

type StructogramRendererProps = {
	id?: string;
	nodes: ASTNode[];
	sx?: SxProps;
};
export const StructogramRenderer: FC<
	StructogramRendererProps
> = (props) => {
	const { nodes, sx, id } = props;

	let component: JSX.Element | JSX.Element[] = (
		<Typography
			fontFamily="inherit"
			fontStyle="italic"
		>
			Start typing to see the preview.
		</Typography>
	);

	if (nodes.length > 0) {
		component = nodes.map((node, index) => (
			<StructogramComponent
				key={index}
				node={node}
				borderLeft
				borderTop
				borderRight
				borderBottom={index === nodes.length - 1}
			/>
		));
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
