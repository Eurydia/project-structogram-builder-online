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

type DiagramWrapperProps = {
	children: ReactNode | ReactNode[];
	borderTop?: boolean;
	borderBottom?: boolean;
	borderRight?: boolean;
	borderLeft?: boolean;
};
const DiagramWrapper: FC<DiagramWrapperProps> = (
	props,
) => {
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
				borderStyle: "solid",
				borderLeftWidth: borderLeft ? 2 : 0,
				borderTopWidth: borderTop ? 2 : 0,
				borderBottomWidth: borderBottom ? 2 : 0,
				borderRightWidth: borderRight ? 2 : 0,
			}}
		>
			{children}
		</Box>
	);
};

type DiagramComponentTextProps =
	TypographyProps & {
		children?: string;
	};
const DiagramComponentText: FC<
	DiagramComponentTextProps
> = (props) => {
	const { children, ...rest } = props;

	return (
		<Typography
			padding={1.5}
			{...rest}
			sx={{
				fontFamily: "Fira Code",
				wordBreak: "break-word",
				fontVariantLigatures: "contextual",
				...rest.sx,
			}}
		>
			{children ?? "-"}
		</Typography>
	);
};

type DiagramProcessProps = {
	text?: string;
	borderTop?: boolean;
	borderBottom?: boolean;
	borderRight?: boolean;
	borderLeft?: boolean;
};
const DiagramNodeProcess: FC<
	DiagramProcessProps
> = (props) => {
	const { text, ...rest } = props;

	return (
		<DiagramWrapper {...rest}>
			<DiagramComponentText>
				{text}
			</DiagramComponentText>
		</DiagramWrapper>
	);
};

type DiagramLoopFirstProps = {
	condition?: string;
	body: Node[];
	borderTop?: boolean;
	borderBottom?: boolean;
	borderRight?: boolean;
	borderLeft?: boolean;
};
export const DiagramLoopFirst: FC<
	DiagramLoopFirstProps
> = (props) => {
	const { condition, body, ...rest } = props;

	let bodyNode: ReactNode | ReactNode[] = (
		<DiagramNodeProcess
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
		<DiagramWrapper {...rest}>
			<DiagramComponentText>
				{condition}
			</DiagramComponentText>
			<Box paddingLeft={2}>{bodyNode}</Box>
		</DiagramWrapper>
	);
};

type DiagramLoopLastProps = {
	condition?: string;
	body: Node[];
	borderTop?: boolean;
	borderBottom?: boolean;
	borderRight?: boolean;
	borderLeft?: boolean;
};
export const DiagramLoopLast: FC<
	DiagramLoopLastProps
> = (props) => {
	const { condition, body, ...rest } = props;

	let bodyNode: ReactNode | ReactNode[] = (
		<DiagramNodeProcess
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
		<DiagramWrapper {...rest}>
			<Box paddingLeft={2}>{bodyNode}</Box>
			<DiagramComponentText>
				{condition}
			</DiagramComponentText>
		</DiagramWrapper>
	);
};

type DiagramIfElseProps = {
	condition?: string;
	bodyIf: Node[];
	bodyElse: Node[];
	borderTop?: boolean;
	borderBottom?: boolean;
	borderRight?: boolean;
	borderLeft?: boolean;
};
export const DiagramIfElse: FC<
	DiagramIfElseProps
> = (props) => {
	const { condition, bodyIf, bodyElse, ...rest } =
		props;

	let bodyNodeIf: ReactNode | ReactNode[] = (
		<DiagramNodeProcess borderTop />
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
		<DiagramNodeProcess borderTop />
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
		<DiagramWrapper {...rest}>
			<Grid
				container
				height="100%"
			>
				<Grid
					item
					xs={12}
				>
					<DiagramComponentText align="center">
						{condition}
					</DiagramComponentText>
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
						<DiagramComponentText
							sx={{
								zIndex: 2,
								backgroundColor: grey[300],
							}}
						>
							True
						</DiagramComponentText>
						<ArrowTopLeftBottomRight htmlColor="black" />
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
						<ArrowBottomLeftTopRight />
						<DiagramComponentText
							sx={{
								zIndex: 2,
								backgroundColor: grey[300],
							}}
						>
							False
						</DiagramComponentText>
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
							borderRightWidth: 2,
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
		</DiagramWrapper>
	);
};

type DiagramFuncProps = {
	declaration: string;
	body: Node[];
	borderTop?: boolean;
	borderBottom?: boolean;
	borderRight?: boolean;
	borderLeft?: boolean;
};
const DiagramFunc: FC<DiagramFuncProps> = (
	props,
) => {
	const { declaration, body, ...rest } = props;

	let bodyNode: ReactNode | ReactNode[] = (
		<DiagramNodeProcess
			borderTop
			borderLeft
			borderRight
		/>
	);
	if (body.length > 0) {
		bodyNode = body.map((subnode, index) => (
			<StructogramNode
				key={`subnode-${index}`}
				node={subnode}
				borderTop
				borderLeft
				borderRight
			/>
		));
	}

	return (
		<DiagramWrapper {...rest}>
			<DiagramComponentText align="center">
				{declaration}
			</DiagramComponentText>
			<Box paddingX={2}>{bodyNode}</Box>
		</DiagramWrapper>
	);
};

type DiagramErrorProps = {
	context: string;
	reason: string;
	line: number;
	character: number;
	borderTop?: boolean;
	borderBottom?: boolean;
	borderRight?: boolean;
	borderLeft?: boolean;
};
const DiagramError: FC<DiagramErrorProps> = (
	props,
) => {
	const {
		context,
		reason,
		line,
		character,
		...rest
	} = props;

	return (
		<DiagramWrapper {...rest}>
			<DiagramComponentText>
				{`At line ${line}, character ${character}: ${reason}`}
			</DiagramComponentText>
			<DiagramComponentText
				sx={{
					paddingLeft: 1,
					paddingY: 0,
				}}
			>
				{context}
			</DiagramComponentText>
			<DiagramComponentText
				paddingLeft={1}
				sx={{
					paddingLeft: 1,
					paddingY: 0,
				}}
			>
				{"~".repeat(context.length - 1) + "^"}
			</DiagramComponentText>
		</DiagramWrapper>
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
		case NodeKind.ERROR: {
			return (
				<DiagramError
					{...rest}
					context={node.context}
					reason={node.reason}
					line={node.rowPos}
					character={node.colPos}
				/>
			);
		}

		case NodeKind.FUNC: {
			let text: string = "";
			if (node.decl.length > 0) {
				text = node.decl
					.map((token) => token.text)
					.join("")
					.trim();
			}
			return (
				<DiagramFunc
					declaration={text}
					body={node.body}
					{...rest}
				/>
			);
		}

		case NodeKind.LOOP_FIRST: {
			let text: string | undefined;
			if (node.condition.length > 0) {
				text = node.condition
					.map((token) => token.text)
					.join("")
					.trim();
			}
			return (
				<DiagramLoopFirst
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
				<DiagramLoopLast
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
				<DiagramIfElse
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
				<DiagramNodeProcess
					{...rest}
					text={text}
				/>
			);
		}
	}
	return <Fragment />;
};
