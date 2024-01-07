import { FC, Fragment, ReactNode } from "react";
import {
	Box,
	Grid,
	TypographyProps,
	Typography,
	Stack,
} from "@mui/material";
import { grey } from "@mui/material/colors";

import { ArrowTopLeftBottomRight } from "./ArrowTopLeftBottomRight";
import { ArrowBottomLeftTopRight } from "./ArrowBottomLeftTopRight";
import { Node, NodeKind } from "interpreter";

type StructogramNodeWrapperProps = {
	children: ReactNode | ReactNode[];
	borderTop?: boolean;
	borderBottom?: boolean;
	borderRight?: boolean;
	borderLeft?: boolean;
};
const StructogramNodeWrapper: FC<
	StructogramNodeWrapperProps
> = (props) => {
	const {
		children,
		borderTop,
		borderBottom,
		borderLeft,
		borderRight,
	} = props;
	return (
		<Box
			sx={{
				borderColor: "inherit",
				backgroundColor: "inherit",
				borderStyle: "solid",
				borderLeftWidth: borderLeft
					? "inherit"
					: 0,
				borderTopWidth: borderTop ? "inherit" : 0,
				borderBottomWidth: borderBottom
					? "inherit"
					: 0,
				borderRightWidth: borderRight
					? "inherit"
					: 0,
			}}
		>
			{children}
		</Box>
	);
};

type StructogramComponentTextProps =
	TypographyProps & {
		children?: string;
	};
const StructogramComponentText: FC<
	StructogramComponentTextProps
> = (props) => {
	const { children, ...rest } = props;

	return (
		<Typography
			fontFamily="inherit"
			fontWeight="inherit"
			padding={1}
			paddingLeft={2}
			{...rest}
		>
			{children ?? "..."}
		</Typography>
	);
};

type StructogramNodeProcessProps = {
	text?: string;
	borderTop?: boolean;
	borderBottom?: boolean;
	borderRight?: boolean;
	borderLeft?: boolean;
};
const StructogramNodeProcess: FC<
	StructogramNodeProcessProps
> = (props) => {
	const { text, ...rest } = props;

	return (
		<StructogramNodeWrapper {...rest}>
			<StructogramComponentText>
				{text}
			</StructogramComponentText>
		</StructogramNodeWrapper>
	);
};

type StructogramNodeLoopFirstProps = {
	condition?: string;
	body: Node[];
	borderTop?: boolean;
	borderBottom?: boolean;
	borderRight?: boolean;
	borderLeft?: boolean;
};
export const StructogramNodeLoopFirst: FC<
	StructogramNodeLoopFirstProps
> = (props) => {
	const { condition, body, ...rest } = props;

	let bodyNode: ReactNode | ReactNode[] = (
		<StructogramNodeProcess
			borderTop
			borderLeft
		/>
	);

	if (body.length > 0) {
		bodyNode = body.map((subnode, index) => (
			<StructogramNode
				key={`subnode-${index}`}
				borderTop
				borderLeft
				node={subnode}
			/>
		));
	}

	return (
		<StructogramNodeWrapper {...rest}>
			<StructogramComponentText>
				{condition}
			</StructogramComponentText>
			<Box paddingLeft={2}>{bodyNode}</Box>
		</StructogramNodeWrapper>
	);
};

type StructogramNodeLoopLastProps = {
	condition?: string;
	body: Node[];
	borderTop?: boolean;
	borderBottom?: boolean;
	borderRight?: boolean;
	borderLeft?: boolean;
};
export const StructogramNodeLoopLast: FC<
	StructogramNodeLoopLastProps
> = (props) => {
	const { condition, body, ...rest } = props;

	let bodyNode: ReactNode | ReactNode[] = (
		<StructogramNodeProcess
			borderBottom
			borderLeft
		/>
	);
	if (body.length > 0) {
		bodyNode = body.map((subnode, index) => (
			<StructogramNode
				key={`subnode-${index}`}
				node={subnode}
				borderBottom
				borderLeft
			/>
		));
	}
	return (
		<StructogramNodeWrapper {...rest}>
			<Box paddingLeft={2}>{bodyNode}</Box>
			<StructogramComponentText>
				{condition}
			</StructogramComponentText>
		</StructogramNodeWrapper>
	);
};

type StructogramNodeIfElseProps = {
	condition?: string;
	bodyIf: Node[];
	bodyElse: Node[];
	borderTop?: boolean;
	borderBottom?: boolean;
	borderRight?: boolean;
	borderLeft?: boolean;
};
export const StructogramNodeIfElse: FC<
	StructogramNodeIfElseProps
> = (props) => {
	const { condition, bodyIf, bodyElse, ...rest } =
		props;

	let bodyNodeIf: ReactNode | ReactNode[] = (
		<StructogramNodeProcess
			borderTop
			borderRight
		/>
	);
	if (bodyIf.length > 0) {
		bodyNodeIf = bodyIf.map((subnode, index) => (
			<StructogramNode
				key={`index-${index}`}
				borderTop
				node={subnode}
			/>
		));
	}

	let bodyNodeElse: ReactNode | ReactNode[] = (
		<StructogramNodeProcess borderTop />
	);
	if (bodyElse.length > 0) {
		bodyNodeElse = bodyElse.map(
			(subnode, index) => (
				<StructogramNode
					key={`index-${index}`}
					borderTop
					node={subnode}
				/>
			),
		);
	}

	return (
		<StructogramNodeWrapper {...rest}>
			<Grid
				container
				height="100%"
			>
				<Grid
					item
					xs={12}
				>
					<StructogramComponentText>
						{condition}
					</StructogramComponentText>
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
					>
						<ArrowTopLeftBottomRight color="inherit" />
						<StructogramComponentText
							sx={{
								zIndex: 2,
								backgroundColor: grey[300],
							}}
						>
							True
						</StructogramComponentText>
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
					>
						<ArrowBottomLeftTopRight color="inherit" />
						<StructogramComponentText
							sx={{
								zIndex: 2,
								backgroundColor: grey[300],
							}}
						>
							False
						</StructogramComponentText>
					</Box>
				</Grid>
				<Grid
					item
					xs={6}
				>
					<Stack
						height="100%"
						sx={{
							borderColor: "inherit",
							borderRightStyle: "solid",
							borderRightWidth: "inherit",
						}}
					>
						{bodyNodeIf}
					</Stack>
				</Grid>
				<Grid
					item
					xs={6}
				>
					<Stack height="100%">
						{bodyNodeElse}
					</Stack>
				</Grid>
			</Grid>
		</StructogramNodeWrapper>
	);
};

const fitlerEmptyProcessNodes = (
	node: Node,
): boolean => {
	return (
		node.kind !== NodeKind.PROCESS ||
		node.body
			.map((token) => token.text)
			.join("")
			.trim().length > 0
	);
};

type StructogramNodeProps = {
	node: Node;
	borderTop?: boolean;
	borderBottom?: boolean;
	borderRight?: boolean;
	borderLeft?: boolean;
};
export const StructogramNode: FC<
	StructogramNodeProps
> = (props) => {
	const { node, ...rest } = props;

	switch (node.kind) {
		case NodeKind.LOOP_FIRST: {
			let text: string | undefined;
			if (node.condition.length > 0) {
				text = node.condition
					.map((token) => token.text)
					.join("")
					.trim();
			}
			return (
				<StructogramNodeLoopFirst
					{...rest}
					condition={text}
					body={node.body.filter(
						fitlerEmptyProcessNodes,
					)}
				/>
			);
		}
		case NodeKind.LOOP_LAST: {
			let text: string | undefined;
			if (node.condition.length > 0) {
				text = node.condition
					.map((token) => token.text)
					.join("")
					.trim();
			}
			return (
				<StructogramNodeLoopLast
					{...rest}
					condition={text}
					body={node.body.filter(
						fitlerEmptyProcessNodes,
					)}
				/>
			);
		}
		case NodeKind.IF_ELSE: {
			let text: string | undefined;
			if (node.condition.length > 0) {
				text = node.condition
					.map((token) => token.text)
					.join("")
					.trim();
			}
			return (
				<StructogramNodeIfElse
					{...rest}
					condition={text}
					bodyIf={node.bodyIf.filter(
						fitlerEmptyProcessNodes,
					)}
					bodyElse={node.bodyElse.filter(
						fitlerEmptyProcessNodes,
					)}
				/>
			);
		}
		case NodeKind.PROCESS: {
			let text: string | undefined = node.body
				.map((token) => token.text)
				.join("")
				.trim();

			if (text.length === 0) {
				text = undefined;
			}

			return (
				<StructogramNodeProcess
					{...rest}
					text={text}
				/>
			);
		}
	}
	return <Fragment />;
};
