import { FC, ReactNode } from "react";

import {
	Box,
	SxProps,
	Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";

import { DiagramNode } from "interpreter";
import { Diagram } from "App/components/Diagram/Diagram";

type DiagramPreviewProps = {
	nodes: DiagramNode[];
	id: string;
	boxProps: SxProps;
};
export const DiagramPreview: FC<
	DiagramPreviewProps
> = (props): ReactNode => {
	const { nodes, id, boxProps } = props;

	let component: ReactNode | ReactNode[] = (
		<Typography
			fontFamily="inherit"
			fontStyle="italic"
		>
			Nothing to display.
		</Typography>
	);
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
		<Box
			sx={{
				...boxProps,
				backgroundColor: grey[300],
				borderColor: grey[700],
			}}
		>
			<Box
				id={id}
				sx={{
					maxWidth: "640px",
					backgroundColor: grey[300],
					borderColor: grey[700],
				}}
			>
				{component}
			</Box>
		</Box>
	);
};
