import { Fragment, FC } from "react";
import { Box, Typography } from "@mui/material";

import { ASTNode, ASTNodeKind } from "ast/parser";

type ASTNodeComponentProps = {
	node: ASTNode;
};
export const ASTNodeComponent: FC<
	ASTNodeComponentProps
> = (props) => {
	if (
		props.node.kind === ASTNodeKind.LOOP_FIRST
	) {
		return (
			<Box
				sx={{
					borderWidth: 1,
					borderStyle: "solid",
					borderColor: "primary.main",
				}}
			>
				<Typography paddingLeft={8}>
					{props.node.control
						.map((t) => t.text)
						.join(" ")}
				</Typography>
				<Box paddingLeft={8}>
					{props.node.body.map((node, index) => (
						<ASTNodeComponent
							key={index}
							node={node}
						/>
					))}
				</Box>
			</Box>
		);
	}

	if (props.node.kind === ASTNodeKind.LOOP_LAST) {
		return (
			<Box
				sx={{
					borderWidth: 1,
					borderStyle: "solid",
					borderColor: "primary.main",
				}}
			>
				<Box paddingLeft={8}>
					{props.node.body.map((node, index) => (
						<ASTNodeComponent
							key={index}
							node={node}
						/>
					))}
				</Box>
				<Typography paddingLeft={8}>
					{props.node.control
						.map((t) => t.text)
						.join(" ")}
				</Typography>
			</Box>
		);
	}

	if (props.node.kind === ASTNodeKind.IF_ELSE) {
		return (
			<Box
				sx={{
					borderWidth: 1,
					borderStyle: "solid",
					borderColor: "primary.main",
				}}
			></Box>
		);
	}

	if (props.node.kind === ASTNodeKind.END) {
		return <Fragment />;
	}

	return (
		<Box
			padding={1}
			sx={{
				borderWidth: 1,
				borderStyle: "solid",
				borderColor: "primary.main",
			}}
		>
			<Typography
				paddingLeft={2}
				sx={{
					fontFamily: "monospace",
				}}
			>
				{props.node.body
					.map((t) => t.text)
					.join(" ")}
			</Typography>
		</Box>
	);
};
