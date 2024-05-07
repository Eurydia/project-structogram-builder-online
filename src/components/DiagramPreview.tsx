import {
	Box,
	SxProps,
	Typography,
	styled,
} from "@mui/material";
import { FC, ReactNode } from "react";
import { DiagramNode } from "~core/parser";
import { Diagram } from "./Diagram";

const StyledBox = styled(Box)(({ theme }) => ({
	maxWidth: "640px",
	backgroundColor: theme.palette.common.white,
	borderColor: theme.palette.text.primary,
}));

/**
 * This component is a preview of the diagram.
 * It prepares the root-level nodes and recursively renders their children.
 */
type DiagramPreviewProps = {
	nodes: DiagramNode[];
	id: string;
	boxProps: SxProps;
};
export const DiagramPreview: FC<
	DiagramPreviewProps
> = (props): ReactNode => {
	const { nodes, id, boxProps } = props;

	// Empty state of the preview
	let component: ReactNode | ReactNode[] = (
		<Typography
			fontFamily="Fira Code"
			fontStyle="italic"
		>
			Nothing to display.
		</Typography>
	);
	// If there are nodes, render them
	if (nodes.length > 0) {
		component = nodes.map((node, index) => (
			<Diagram
				key={`top-level-node-${index}`}
				node={node}
				borderLeft
				borderTop
				borderRight
				borderBottom={index === nodes.length - 1}
			/>
		));
	}

	return (
		<Box sx={boxProps}>
			<StyledBox
				id={id}
				children={component}
			/>
		</Box>
	);
};
