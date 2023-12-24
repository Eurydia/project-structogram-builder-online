import { FC, Fragment, ReactNode } from "react";
import {
	Box,
	Grid,
	Stack,
	SvgIcon,
	SvgIconProps,
	Typography,
	TypographyProps,
} from "@mui/material";
import { grey } from "@mui/material/colors";

import Latex from "react-latex-next";

import { ASTNode, ASTNodeKind } from "ast/parser";
import { TokenKind } from "ast/lexer";

const ArrowBottomLeftTopRight: FC<
	SvgIconProps
> = (props) => {
	const { sx } = props;

	return (
		<SvgIcon
			sx={{
				position: "absolute",
				width: "100%",
				height: "100%",
				...sx,
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				preserveAspectRatio="none"
				fill="none"
				viewBox="0 0 5 5"
				strokeWidth="0.1"
			>
				<line
					x1="0"
					y1="5"
					x2="5"
					y2="0"
					stroke="currentColor"
					strokeLinecap="round"
				/>
			</svg>
		</SvgIcon>
	);
};

const ArrowTopLeftBottomRight: FC<
	SvgIconProps
> = (props) => {
	const { sx } = props;

	return (
		<SvgIcon
			sx={{
				position: "absolute",
				width: "100%",
				height: "100%",
				...sx,
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				preserveAspectRatio="none"
				fill="none"
				viewBox="0 0 5 5"
				strokeWidth="0.1"
			>
				<line
					x1="0"
					y1="0"
					x2="5"
					y2="5"
					stroke="currentColor"
					strokeLinecap="round"
				/>
			</svg>
		</SvgIcon>
	);
};

const MOCK_NODE: ASTNode = {
	kind: ASTNodeKind.PROCESS,
	body: [
		{
			kind: TokenKind.SYMBOL,
			text: "...",
		},
	],
};

type StructogramComponentTextProps =
	TypographyProps & {
		text: string;
	};
const StructogramComponentText: FC<
	StructogramComponentTextProps
> = (props) => {
	const { text, ...rest } = props;
	return (
		<Typography
			fontFamily="inherit"
			fontWeight="inherit"
			padding={1}
			paddingLeft={2}
			{...rest}
		>
			<Latex
				delimiters={[
					{
						left: "$",
						right: "$",
						display: false,
					},
				]}
			>
				{text}
			</Latex>
		</Typography>
	);
};

type StructogramComponentProps = {
	node: ASTNode;

	borderTop?: boolean;
	borderBottom?: boolean;
	borderRight?: boolean;
	borderLeft?: boolean;
};
export const StructogramComponent: FC<
	StructogramComponentProps
> = (props) => {
	const {
		node,
		borderTop,
		borderBottom,
		borderRight,
		borderLeft,
	} = props;

	const paddingSize = 1;
	const borderWidth = 3;
	const borderColor = grey[800];
	const backgroundColor = grey[300];

	const sx = {
		borderColor,
		backgroundColor,
		borderStyle: "solid",
		borderLeftWidth: borderLeft ? borderWidth : 0,
		borderTopWidth: borderTop ? borderWidth : 0,
		borderBottomWidth: borderBottom
			? borderWidth
			: 0,
		borderRightWidth: borderRight
			? borderWidth
			: 0,
	};

	let preparedNode: ReactNode = <Fragment />;

	if (node.kind === ASTNodeKind.LOOP_FIRST) {
		let nodeText: string = "...";
		if (node.control.length > 0) {
			nodeText = node.control
				.map((t) => t.text)
				.join(" ");
		}

		let bodyNode: ReactNode = (
			<StructogramComponent
				node={MOCK_NODE}
				borderTop
				borderLeft
			/>
		);
		if (node.body.length > 0) {
			bodyNode = (
				<Fragment>
					{node.body.map((n, index) => (
						<StructogramComponent
							key={index}
							node={n}
							borderTop
							borderLeft
						/>
					))}
				</Fragment>
			);
		}

		preparedNode = (
			<Fragment>
				<StructogramComponentText
					text={nodeText}
				/>
				<Box paddingLeft={2}>{bodyNode}</Box>
			</Fragment>
		);
	}

	if (node.kind === ASTNodeKind.LOOP_LAST) {
		let nodeText: string = "...";
		if (node.control.length > 0) {
			nodeText = node.control
				.map((t) => t.text)
				.join(" ");
		}

		let bodyNode: ReactNode = (
			<StructogramComponent
				node={MOCK_NODE}
				borderBottom
				borderLeft
			/>
		);
		if (node.body.length > 0) {
			bodyNode = (
				<Fragment>
					{node.body.map((n, index) => (
						<StructogramComponent
							key={index}
							node={n}
							borderBottom
							borderLeft
						/>
					))}
				</Fragment>
			);
		}

		preparedNode = (
			<Fragment>
				<Box paddingLeft={2}>{bodyNode}</Box>
				<StructogramComponentText
					text={nodeText}
				/>
			</Fragment>
		);
	}

	if (node.kind === ASTNodeKind.IF_ELSE) {
		let nodeText: string = "...";
		if (node.control.length > 0) {
			nodeText = node.control
				.map((t) => t.text)
				.join(" ");
		}

		let bodyIfNode: ReactNode = (
			<StructogramComponent
				node={MOCK_NODE}
				borderTop
			/>
		);
		if (node.bodyIf.length > 0) {
			bodyIfNode = node.bodyIf.map(
				(node, index) => (
					<StructogramComponent
						key={index}
						node={node}
						borderTop
					/>
				),
			);
		}
		let bodyElseNode: ReactNode = (
			<StructogramComponent
				node={MOCK_NODE}
				borderTop
			/>
		);
		if (node.bodyElse.length > 0) {
			bodyElseNode = node.bodyElse.map(
				(node, index) => (
					<StructogramComponent
						key={index}
						node={node}
						borderTop
					/>
				),
			);
		}

		preparedNode = (
			<Grid
				container
				height="100%"
			>
				<Grid
					item
					xs={12}
				>
					<StructogramComponentText
						text={nodeText}
					/>
				</Grid>
				<Grid
					item
					xs={6}
				>
					<Box
						height="100%"
						display="flex"
						alignItems="center"
						justifyContent="center"
						position="relative"
						padding={paddingSize}
					>
						<ArrowTopLeftBottomRight color="inherit" />
						<StructogramComponentText
							text="True"
							sx={{
								zIndex: 2,
								backgroundColor,
							}}
						/>
					</Box>
				</Grid>
				<Grid
					item
					xs={6}
				>
					<Box
						height="100%"
						display="flex"
						alignItems="center"
						justifyContent="center"
						position="relative"
						padding={paddingSize}
					>
						<ArrowBottomLeftTopRight color="inherit" />
						<StructogramComponentText
							text="False"
							sx={{
								zIndex: 2,
								backgroundColor,
							}}
						/>
					</Box>
				</Grid>
				<Grid
					item
					xs={6}
				>
					<Stack
						height="100%"
						sx={{
							borderRightStyle: "solid",
							borderRightWidth: borderWidth,
							borderRightColor: borderColor,
						}}
					>
						{bodyIfNode}
					</Stack>
				</Grid>
				<Grid
					item
					xs={6}
				>
					<Stack height="100%">
						{bodyElseNode}
					</Stack>
				</Grid>
			</Grid>
		);
	}

	if (node.kind === ASTNodeKind.PROCESS) {
		let nodeText: string = "...";
		if (node.body.length > 0) {
			nodeText = node.body
				.map((t) => t.text)
				.join(" ");
		}

		preparedNode = (
			<StructogramComponentText text={nodeText} />
		);
	}
	return (
		<Box
			height="100%"
			sx={{ ...sx }}
		>
			{preparedNode}
		</Box>
	);
};
