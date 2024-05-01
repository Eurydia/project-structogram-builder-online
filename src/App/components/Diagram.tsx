import {
	StructogramBinaryBranch,
	StructogramError,
	StructogramFunction,
	StructogramLoopFirst,
	StructogramLoopLast,
	StructogramProcess,
} from "@eurydos/structogram-component";
import {
	DiagramNode,
	DiagramNodeKind,
	DiagramToken,
} from "core";
import { FC, Fragment, ReactNode } from "react";

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
		<StructogramProcess {...rest}>
			{bodyText}
		</StructogramProcess>
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
		<StructogramLoopFirst
			{...rest}
			condition={conditionText}
		>
			{bodyNode}
		</StructogramLoopFirst>
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
		<StructogramLoopLast
			{...rest}
			condition={conditionText}
		>
			{bodyNode}
		</StructogramLoopLast>
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

	let conditionText: string | undefined;
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
		<StructogramBinaryBranch
			{...rest}
			condition={conditionText}
			childrenIf={bodyNodeIf}
			childrenElse={bodyNodeElse}
		/>
	);
};

type DiagramFunctionProps = {
	declarationTokens: DiagramToken[];
	body: DiagramNode[];

	borderTop?: boolean;
	borderBottom?: boolean;
	borderRight?: boolean;
	borderLeft?: boolean;
};
const DiagramFunction: FC<
	DiagramFunctionProps
> = (props) => {
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
		<StructogramFunction
			{...rest}
			declaration={declarationText}
		>
			{bodyNode}
		</StructogramFunction>
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
				<StructogramError
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
				<DiagramFunction
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
