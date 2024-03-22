import {
	FC,
	Fragment,
	ReactNode,
	useRef,
} from "react";
import {
	Box,
	Grid,
	TypographyProps,
	Typography,
	Stack,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import Latex from "react-latex-next";

import { ArrowTopLeftBottomRight } from "./ArrowTopLeftBottomRight";
import { ArrowBottomLeftTopRight } from "./ArrowBottomLeftTopRight";
import {
	DiagramNode,
	DiagramNodeKind,
	DiagramToken,
} from "core";

const TEXT_SHADOW = `${grey[300]} 3px 0px 0px, ${grey[300]} 2.83487px 0.981584px 0px, ${grey[300]} 2.35766px 1.85511px 0px, ${grey[300]} 1.62091px 2.52441px 0px, ${grey[300]} 0.705713px 2.91581px 0px, ${grey[300]} -0.287171px 2.98622px 0px, ${grey[300]} -1.24844px 2.72789px 0px, ${grey[300]} -2.07227px 2.16926px 0px, ${grey[300]} -2.66798px 1.37182px 0px, ${grey[300]} -2.96998px 0.42336px 0px, ${grey[300]} -2.94502px -0.571704px 0px, ${grey[300]} -2.59586px -1.50383px 0px, ${grey[300]} -1.96093px -2.27041px 0px, ${grey[300]} -1.11013px -2.78704px 0px, ${grey[300]} -0.137119px -2.99686px 0px, ${grey[300]} 0.850987px -2.87677px 0px, ${grey[300]} 1.74541px -2.43999px 0px, ${grey[300]} 2.44769px -1.73459px 0px, ${grey[300]} 2.88051px -0.838247px 0px`;

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
			<Latex
				delimiters={[
					{
						left: "$",
						right: "$",
						display: false,
					},
				]}
			>
				{children ?? "-"}
			</Latex>
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

	const mainBlockRef =
		useRef<HTMLDivElement | null>(null);
	const ifBlockRef =
		useRef<HTMLDivElement | null>(null);

	let ifBlockWidth: string | undefined =
		undefined;
	let elseBlockWidth: string | undefined =
		undefined;
	if (
		mainBlockRef &&
		mainBlockRef.current &&
		ifBlockRef &&
		ifBlockRef.current
	) {
		ifBlockWidth = `${
			ifBlockRef.current.getBoundingClientRect()
				.width
		}px`;
		elseBlockWidth = `calc(${
			mainBlockRef.current.getBoundingClientRect()
				.width
		}px - ${ifBlockWidth})`;
	}

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
	let leftColumnSize = 6;
	let bodyNodeIf: ReactNode | ReactNode[] = (
		<DiagramProcess borderTop />
	);
	if (bodyIf.length > 0) {
		leftColumnSize += 3;
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
		leftColumnSize -= 3;
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
			<Stack
				ref={mainBlockRef}
				component={Box}
				width="100%"
				height="100%"
			>
				<DiagramComponentText align="center">
					{conditionText}
				</DiagramComponentText>
				<Stack
					width="100%"
					height="100%"
					direction="row"
				>
					<Box
						width={ifBlockWidth}
						height="100%"
						display="flex"
						alignItems="center"
						justifyContent="center"
						position="relative"
					>
						<DiagramComponentText
							sx={{
								zIndex: 2,
								textShadow: TEXT_SHADOW,
							}}
						>
							True
						</DiagramComponentText>
						<ArrowTopLeftBottomRight htmlColor="black" />
					</Box>
					<Box
						width={elseBlockWidth}
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
								textShadow: TEXT_SHADOW,
							}}
						>
							False
						</DiagramComponentText>
					</Box>
				</Stack>
				<Stack
					width="100%"
					height="100%"
					direction="row"
				>
					<Stack
						ref={ifBlockRef}
						component={Box}
						flexGrow={1}
						flexShrink={1}
						minHeight="100%"
						sx={{
							borderColor: "inherit",
							borderRightStyle: "solid",
							borderRightWidth: 2,
						}}
					>
						{bodyNodeIf}
					</Stack>
					<Stack
						flexGrow={1}
						flexShrink={1}
						minHeight="100%"
					>
						{bodyNodeElse}
					</Stack>
				</Stack>
			</Stack>
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
