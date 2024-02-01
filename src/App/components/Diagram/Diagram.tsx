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
import {
	DiagramNode,
	DiagramNodeKind,
	DiagramToken,
} from "interpreter";

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
	bodyTokens?: DiagramToken[];

	borderTop?: boolean;
	borderBottom?: boolean;
	borderRight?: boolean;
	borderLeft?: boolean;
};
const DiagramProcess: FC<DiagramProcessProps> = (
	props,
) => {
	const { bodyTokens, ...rest } = props;

	let bodyText: string | undefined = undefined;
	if (bodyTokens !== undefined) {
		bodyText = bodyTokens
			.map((token) => token.text)
			.join("")
			.trim();
		if (bodyText.length === 0) {
			bodyText = undefined;
		}
	}

	return (
		<DiagramWrapper {...rest}>
			<DiagramComponentText>
				{bodyText}
			</DiagramComponentText>
		</DiagramWrapper>
	);
};

type DiagramLoopFirstProps = {
	conditionTokens?: DiagramToken[];
	body: DiagramNode[];

	borderTop?: boolean;
	borderBottom?: boolean;
	borderRight?: boolean;
	borderLeft?: boolean;
};
export const DiagramLoopFirst: FC<
	DiagramLoopFirstProps
> = (props) => {
	const { conditionTokens, body, ...rest } =
		props;

	let conditionText: string | undefined =
		undefined;
	if (
		conditionTokens !== undefined &&
		conditionTokens.length > 0
	) {
		conditionText = conditionTokens
			.map((token) => token.text)
			.join("")
			.trim();
	}
	let bodyNode: ReactNode | ReactNode[] = (
		<DiagramProcess
			borderTop
			borderLeft
		/>
	);
	if (body.length > 0) {
		bodyNode = body.map((subnode, index) => (
			<Diagram
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
				{conditionText}
			</DiagramComponentText>
			<Box paddingLeft={2}>{bodyNode}</Box>
		</DiagramWrapper>
	);
};

type DiagramLoopLastProps = {
	conditionTokens?: DiagramToken[];
	body: DiagramNode[];

	borderTop?: boolean;
	borderBottom?: boolean;
	borderRight?: boolean;
	borderLeft?: boolean;
};
export const DiagramLoopLast: FC<
	DiagramLoopLastProps
> = (props) => {
	const { conditionTokens, body, ...rest } =
		props;

	let conditionText: string | undefined =
		undefined;
	if (
		conditionTokens !== undefined &&
		conditionTokens.length > 0
	) {
		conditionText = conditionTokens
			.map((token) => token.text)
			.join("")
			.trim();
	}

	let bodyNode: ReactNode | ReactNode[] = (
		<DiagramProcess
			borderBottom
			borderLeft
		/>
	);
	if (body.length > 0) {
		bodyNode = body.map((subnode, index) => (
			<Diagram
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
				{conditionText}
			</DiagramComponentText>
		</DiagramWrapper>
	);
};

type DiagramIfElseProps = {
	conditionTokens?: DiagramToken[];
	bodyIf: DiagramNode[];
	bodyElse: DiagramNode[];

	borderTop?: boolean;
	borderBottom?: boolean;
	borderRight?: boolean;
	borderLeft?: boolean;
};
export const DiagramIfElse: FC<
	DiagramIfElseProps
> = (props) => {
	const {
		conditionTokens,
		bodyIf,
		bodyElse,
		...rest
	} = props;

	let conditionText: string | undefined =
		undefined;
	if (
		conditionTokens !== undefined &&
		conditionTokens.length > 0
	) {
		conditionText = conditionTokens
			.map((token) => token.text)
			.join("")
			.trim();
	}

	let bodyNodeIf: ReactNode | ReactNode[] = (
		<DiagramProcess borderTop />
	);
	if (bodyIf.length > 0) {
		bodyNodeIf = bodyIf.map((subnode, index) => (
			<Diagram
				key={`index-${index}`}
				borderTop
				node={subnode}
			/>
		));
	}

	let bodyNodeElse: ReactNode | ReactNode[] = (
		<DiagramProcess borderTop />
	);
	if (bodyElse.length > 0) {
		bodyNodeElse = bodyElse.map(
			(subnode, index) => (
				<Diagram
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
						{conditionText}
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
	declarationTokens: DiagramToken[];
	body: DiagramNode[];

	borderTop?: boolean;
	borderBottom?: boolean;
	borderRight?: boolean;
	borderLeft?: boolean;
};
const DiagramFunc: FC<DiagramFuncProps> = (
	props,
) => {
	const { declarationTokens, body, ...rest } =
		props;

	let declarationText: string | undefined =
		undefined;
	if (
		declarationTokens !== undefined &&
		declarationTokens.length > 0
	) {
		declarationText = declarationTokens
			.map((token) => token.text)
			.join("")
			.trim();
	}

	let bodyNode: ReactNode | ReactNode[] = (
		<DiagramProcess
			borderTop
			borderLeft
			borderRight
		/>
	);
	if (body.length > 0) {
		bodyNode = body.map((subnode, index) => (
			<Diagram
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
				{declarationText}
			</DiagramComponentText>
			<Box paddingX={2}>{bodyNode}</Box>
		</DiagramWrapper>
	);
};

type DiagramErrorProps = {
	context: string;
	reason: string;
	lineNumber: number;
	charNumber: number;
	caretOffset: number;

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
		lineNumber,
		charNumber,
		caretOffset,

		...rest
	} = props;
	const errorText = `At line ${lineNumber}, character ${charNumber}: ${reason}`;
	const caretText = "~".repeat(caretOffset) + "^";

	return (
		<DiagramWrapper {...rest}>
			<DiagramComponentText>
				{errorText}
			</DiagramComponentText>
			<DiagramComponentText paddingY={0}>
				{context}
			</DiagramComponentText>
			<DiagramComponentText paddingY={0}>
				{caretText}
			</DiagramComponentText>
		</DiagramWrapper>
	);
};

type DiagramProps = {
	node: DiagramNode;

	borderTop?: boolean;
	borderBottom?: boolean;
	borderRight?: boolean;
	borderLeft?: boolean;
};
export const Diagram: FC<DiagramProps> = (
	props,
) => {
	const { node, ...rest } = props;

	switch (node.kind) {
		case DiagramNodeKind.ERROR:
			return (
				<DiagramError
					{...rest}
					caretOffset={node.caretOffset}
					context={node.context}
					reason={node.reason}
					lineNumber={node.lineNumber}
					charNumber={node.charNumber}
				/>
			);
		case DiagramNodeKind.FUNCTION:
			return (
				<DiagramFunc
					declarationTokens={node.declaration}
					body={node.body}
					{...rest}
				/>
			);
		case DiagramNodeKind.LOOP_FIRST:
			return (
				<DiagramLoopFirst
					{...rest}
					conditionTokens={node.condition}
					body={node.body}
				/>
			);
		case DiagramNodeKind.LOOP_LAST:
			return (
				<DiagramLoopLast
					{...rest}
					conditionTokens={node.condition}
					body={node.body}
				/>
			);
		case DiagramNodeKind.IF_ELSE:
			return (
				<DiagramIfElse
					{...rest}
					conditionTokens={node.condition}
					bodyIf={node.bodyIf}
					bodyElse={node.bodyElse}
				/>
			);
		case DiagramNodeKind.PROCESS:
			return (
				<DiagramProcess
					{...rest}
					bodyTokens={node.body}
				/>
			);
	}
	return <Fragment />;
};
