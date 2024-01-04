import { FC, Fragment, ReactNode } from "react";

import { StructogramNodeWrapper } from "renderer/components/StructogramNodeWrapper";
import { StructogramComponentText } from "renderer/components/StructogramNodeText";
import {
	ASTNode,
	ASTNodeIfElse,
	ASTNodeKind,
	ASTNodeLoopFirst,
	ASTNodeLoopLast,
	ASTNodeProcess,
} from "interpreter/parser";
import { Box, Grid } from "@mui/material";
import { ArrowTopLeftBottomRight } from "renderer/components/ArrowTopLeftBottomRight";
import { ArrowBottomLeftTopRight } from "renderer/components/ArrowBottomLeftTopRight";
import { grey } from "@mui/material/colors";

type StructogramNodeProcessProps = {
	node: ASTNodeProcess;
	borderTop?: boolean;
	borderBottom?: boolean;
	borderRight?: boolean;
	borderLeft?: boolean;
};
export const StructogramNodeProcess: FC<
	StructogramNodeProcessProps
> = (props) => {
	const { node, ...rest } = props;

	let text: string | undefined;
	if (node.body.length > 0) {
		text = node.body
			.map((token) => token.text)
			.join("");
	}

	return (
		<StructogramNodeWrapper {...rest}>
			<StructogramComponentText text={text} />
		</StructogramNodeWrapper>
	);
};

type StructogramNodeLoopFirstProps = {
	node: ASTNodeLoopFirst;
	borderTop?: boolean;
	borderBottom?: boolean;
	borderRight?: boolean;
	borderLeft?: boolean;
};
export const StructogramNodeLoopFirst: FC<
	StructogramNodeLoopFirstProps
> = (props) => {
	const { node, ...rest } = props;
	let text: string | undefined;
	if (node.condition.length > 0) {
		text = node.condition
			.map((token) => token.text)
			.join("");
	}

	let bodyNode: ReactNode | ReactNode[] = (
		<StructogramNode
			borderTop
			borderLeft
			node={{
				kind: ASTNodeKind.PROCESS,
				body: [],
			}}
		/>
	);
	if (node.body.length > 0) {
		bodyNode = node.body.map((subnode, index) => (
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
			<StructogramComponentText text={text} />
			<Box paddingLeft={2}>{bodyNode}</Box>
		</StructogramNodeWrapper>
	);
};

type StructogramNodeLoopLastProps = {
	node: ASTNodeLoopLast;
	borderTop?: boolean;
	borderBottom?: boolean;
	borderRight?: boolean;
	borderLeft?: boolean;
};
export const StructogramNodeLoopLast: FC<
	StructogramNodeLoopLastProps
> = (props) => {
	const { node, ...rest } = props;

	let text: string | undefined;
	if (node.condition.length > 0) {
		text = node.condition
			.map((token) => token.text)
			.join("");
	}

	let bodyNode: ReactNode | ReactNode[] = (
		<StructogramNode
			borderBottom
			borderLeft
			node={{
				kind: ASTNodeKind.PROCESS,
				body: [],
			}}
		/>
	);
	if (node.body.length > 0) {
		bodyNode = node.body.map((subnode, index) => (
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
			<StructogramComponentText text={text} />
		</StructogramNodeWrapper>
	);
};

type StructogramNodeIfElseProps = {
	node: ASTNodeIfElse;
	borderTop?: boolean;
	borderBottom?: boolean;
	borderRight?: boolean;
	borderLeft?: boolean;
};
export const StructogramNodeIfElse: FC<
	StructogramNodeIfElseProps
> = (props) => {
	const { node, ...rest } = props;

	let text: string | undefined;
	if (node.condition.length > 0) {
		text = node.condition
			.map((token) => token.text)
			.join("");
	}
	let bodyNodeIf: ReactNode | ReactNode[] = (
		<StructogramNode
			borderTop
			borderRight
			node={{
				kind: ASTNodeKind.PROCESS,
				body: [],
			}}
		/>
	);
	if (node.bodyIf.length > 0) {
		bodyNodeIf = node.bodyIf.map(
			(subnode, index) => (
				<StructogramNode
					key={`index-${index}`}
					borderTop
					borderRight
					node={subnode}
				/>
			),
		);
	}

	let bodyNodeElse: ReactNode | ReactNode[] = (
		<StructogramNode
			borderTop
			node={{
				kind: ASTNodeKind.PROCESS,
				body: [],
			}}
		/>
	);
	if (node.bodyElse.length > 0) {
		bodyNodeElse = node.bodyElse.map(
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
					<StructogramComponentText text={text} />
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
							text="True"
							sx={{
								zIndex: 2,
								backgroundColor: grey[300],
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
					>
						<ArrowBottomLeftTopRight color="inherit" />
						<StructogramComponentText
							text="False"
							sx={{
								zIndex: 2,
								backgroundColor: grey[300],
							}}
						/>
					</Box>
				</Grid>
				<Grid
					item
					xs={6}
				>
					{bodyNodeIf}
				</Grid>
				<Grid
					item
					xs={6}
				>
					{bodyNodeElse}
				</Grid>
			</Grid>
		</StructogramNodeWrapper>
	);
};

type StructogramNodeProps = {
	node: ASTNode;
	borderTop?: boolean;
	borderBottom?: boolean;
	borderRight?: boolean;
	borderLeft?: boolean;
};
export const StructogramNode: FC<
	StructogramNodeProps
> = (props) => {
	const { node, ...rest } = props;

	let renderedNode = <Fragment />;

	switch (node.kind) {
		case ASTNodeKind.LOOP_FIRST:
			renderedNode = (
				<StructogramNodeLoopFirst node={node} />
			);
			break;
		case ASTNodeKind.LOOP_LAST:
			renderedNode = (
				<StructogramNodeLoopLast node={node} />
			);
			break;
		case ASTNodeKind.IF_ELSE:
			renderedNode = (
				<StructogramNodeIfElse node={node} />
			);
			break;
		case ASTNodeKind.PROCESS:
			renderedNode = (
				<StructogramNodeProcess node={node} />
			);
			break;
	}

	return (
		<StructogramNodeWrapper {...rest}>
			{renderedNode}
		</StructogramNodeWrapper>
	);
};
