import { Token, TokenKind } from "ast/lexer";

export enum ASTNodeKind {
	END,
	PROCESS,
	LOOP_FIRST,
	LOOP_LAST,
	IF_ELSE,
}

export type ASTNodeEnd = {
	kind: ASTNodeKind.END;
};

export type ASTNodeProcess = {
	kind: ASTNodeKind.PROCESS;
	body: Token[];
};

export type ASTNodeLoopFirst = {
	kind: ASTNodeKind.LOOP_FIRST;
	control: Token[];
	body: ASTNode[];
};

export type ASTNodeLoopLast = {
	kind: ASTNodeKind.LOOP_LAST;
	control: Token[];
	body: ASTNode[];
};

export type ASTNodeIfElse = {
	kind: ASTNodeKind.IF_ELSE;
	control: Token[];
	bodyIf: ASTNode[];
	bodyElse: ASTNode[];
};

export type ASTNode =
	| ASTNodeEnd
	| ASTNodeProcess
	| ASTNodeLoopFirst
	| ASTNodeLoopLast
	| ASTNodeIfElse;

export type Parser = {
	tokens: Token[];
	tokenLength: number;
	cursor: number;
};

export const parserInit = (
	tokens: Token[],
): Parser => {
	return {
		tokens: tokens,
		tokenLength: tokens.length,
		cursor: 0,
	};
};

const parserGetNextTokenThenAdvance = (
	p: Parser,
): Token => {
	if (p.cursor < p.tokenLength) {
		const token = p.tokens[p.cursor];
		p.cursor++;

		return token;
	}

	return {
		kind: TokenKind.END,
		text: "",
	};
};

const parserBuildLoopFirstNode = (
	p: Parser,
): ASTNodeLoopFirst => {
	const node: ASTNodeLoopFirst = {
		kind: ASTNodeKind.LOOP_FIRST,
		body: [],
		control: [],
	};

	if (
		parserGetNextTokenThenAdvance(p).kind !==
		TokenKind.LEFT_PAREN
	) {
		return node;
	}

	const controlTokens: Token[] = [];
	let controlToken: Token;
	let parenDepth = -1;
	while (
		(controlToken =
			parserGetNextTokenThenAdvance(p)).kind !==
		TokenKind.END
	) {
		switch (controlToken.kind) {
			case TokenKind.LEFT_PAREN:
				parenDepth--;
				break;
			case TokenKind.RIGHT_PAREN:
				parenDepth++;
				break;
			default:
				break;
		}
		console.debug(
			"depth",
			parenDepth,
			controlToken,
		);

		if (parenDepth === 0) {
			break;
		}
		controlTokens.push(controlToken);
	}

	if (
		parserGetNextTokenThenAdvance(p).kind !==
		TokenKind.LEFT_CURLY
	) {
		return node;
	}

	const bodyTokens: Token[] = [];
	let bodyToken: Token;
	let curltyDepth = -1;
	while (
		(bodyToken = parserGetNextTokenThenAdvance(p))
			.kind !== TokenKind.END
	) {
		switch (bodyToken.kind) {
			case TokenKind.LEFT_CURLY:
				curltyDepth--;
				break;
			case TokenKind.RIGHT_CURLY:
				curltyDepth++;
				break;
			default:
				break;
		}

		if (curltyDepth === 0) {
			break;
		}

		bodyTokens.push(bodyToken);
	}

	// recursively parse tokens inside loop body
	const bodyParser = parserInit(bodyTokens);
	const bodyNodes: ASTNode[] = [];
	let bodyNode: ASTNode;
	while (
		(bodyNode =
			parserGetNextNodeThenAdvance(bodyParser))
			.kind !== ASTNodeKind.END
	) {
		bodyNodes.push(bodyNode);
	}

	node["body"] = bodyNodes;
	node["control"] = controlTokens;

	return node;
};

const parserBuildLoopLastNode = (
	p: Parser,
): ASTNodeLoopLast => {
	const node: ASTNodeLoopLast = {
		kind: ASTNodeKind.LOOP_LAST,
		body: [],
		control: [],
	};

	if (
		parserGetNextTokenThenAdvance(p).kind !==
		TokenKind.LEFT_CURLY
	) {
		return node;
	}

	const bodyTokens: Token[] = [];
	let bodyToken: Token;
	let curlyDepth = -1;
	while (
		(bodyToken = parserGetNextTokenThenAdvance(p))
			.kind !== TokenKind.END
	) {
		switch (bodyToken.kind) {
			case TokenKind.LEFT_CURLY:
				curlyDepth--;
				break;
			case TokenKind.RIGHT_CURLY:
				curlyDepth++;
				break;
			default:
				break;
		}

		if (curlyDepth === 0) {
			break;
		}

		bodyTokens.push(bodyToken);
	}

	if (
		parserGetNextTokenThenAdvance(p).kind !==
			TokenKind.KEYWORD ||
		p.tokens[p.cursor].text !== "while"
	) {
		return node;
	}

	if (
		parserGetNextTokenThenAdvance(p).kind !==
		TokenKind.LEFT_PAREN
	) {
		return node;
	}

	const controlTokens: Token[] = [];
	let controlToken: Token;
	let parenDepth = -1;
	while (
		(controlToken =
			parserGetNextTokenThenAdvance(p)).kind !==
		TokenKind.END
	) {
		switch (controlToken.kind) {
			case TokenKind.LEFT_PAREN:
				parenDepth--;
				break;
			case TokenKind.RIGHT_PAREN:
				parenDepth++;
				break;
			default:
				break;
		}

		if (parenDepth === 0) {
			break;
		}

		controlTokens.push(controlToken);
	}

	if (
		parserGetNextTokenThenAdvance(p).kind !==
		TokenKind.SEMICOLON
	) {
		return node;
	}

	const bodyParser = parserInit(bodyTokens);
	const bodyNodes: ASTNode[] = [];
	let bodyNode: ASTNode;
	while (
		(bodyNode =
			parserGetNextNodeThenAdvance(bodyParser))
			.kind !== ASTNodeKind.END
	) {
		bodyNodes.push(bodyNode);
	}

	node["control"] = controlTokens;
	node["body"] = bodyNodes;

	return node;
};

const parseBuildIfElseNode = (
	p: Parser,
): ASTNodeIfElse => {
	const node: ASTNodeIfElse = {
		kind: ASTNodeKind.IF_ELSE,
		control: [],
		bodyIf: [],
		bodyElse: [],
	};
	if (
		parserGetNextTokenThenAdvance(p).kind !==
		TokenKind.LEFT_PAREN
	) {
		return node;
	}

	const controlTokens: Token[] = [];
	let controlToken: Token;
	let parenDepth = -1;
	while (
		(controlToken =
			parserGetNextTokenThenAdvance(p)).kind !==
		TokenKind.END
	) {
		switch (controlToken.kind) {
			case TokenKind.LEFT_PAREN:
				parenDepth--;
				break;
			case TokenKind.RIGHT_PAREN:
				parenDepth++;
				break;
			default:
				break;
		}

		if (parenDepth === 0) {
			break;
		}

		controlTokens.push(controlToken);
	}

	if (
		parserGetNextTokenThenAdvance(p).kind !==
		TokenKind.LEFT_CURLY
	) {
		return node;
	}

	const bodyIfTokens: Token[] = [];
	let bodyIfToken: Token;
	let curlyDepth = -1;
	while (
		(bodyIfToken =
			parserGetNextTokenThenAdvance(p)).kind !==
		TokenKind.END
	) {
		switch (bodyIfToken.kind) {
			case TokenKind.LEFT_CURLY:
				curlyDepth--;
				break;
			case TokenKind.RIGHT_CURLY:
				curlyDepth++;
				break;
			default:
				break;
		}
		if (curlyDepth === 0) {
			break;
		}
		bodyIfTokens.push(bodyIfToken);
	}

	const bodyIfParser = parserInit(bodyIfTokens);
	const bodyIfNodes: ASTNode[] = [];
	let bodyIfNode: ASTNode;
	while (
		(bodyIfNode =
			parserGetNextNodeThenAdvance(bodyIfParser))
			.kind !== ASTNodeKind.END
	) {
		bodyIfNodes.push(bodyIfNode);
	}

	node["control"] = controlTokens;
	node["bodyIf"] = bodyIfNodes;

	if (
		parserGetNextTokenThenAdvance(p).kind !==
			TokenKind.KEYWORD ||
		p.tokens[p.cursor].text !== "else"
	) {
		return node;
	}

	if (
		parserGetNextTokenThenAdvance(p).kind !==
		TokenKind.LEFT_CURLY
	) {
		return node;
	}

	const bodyElseTokens: Token[] = [];
	let bodyElseToken: Token;
	curlyDepth = -1;
	while (
		(bodyElseToken =
			parserGetNextTokenThenAdvance(p)).kind !==
		TokenKind.END
	) {
		switch (bodyElseToken.kind) {
			case TokenKind.LEFT_CURLY:
				curlyDepth--;
				break;
			case TokenKind.RIGHT_CURLY:
				curlyDepth++;
				break;
			default:
				break;
		}
		if (curlyDepth === 0) {
			break;
		}
		bodyElseTokens.push(bodyElseToken);
	}

	const bodyElseParser = parserInit(bodyIfTokens);
	const bodyElseNodes: ASTNode[] = [];
	let bodyElseNode: ASTNode;
	while (
		(bodyElseNode = parserGetNextNodeThenAdvance(
			bodyElseParser,
		)).kind !== ASTNodeKind.END
	) {
		bodyElseNodes.push(bodyElseNode);
	}

	node["bodyElse"] = bodyIfNodes;
	return node;
};

export const parserGetNextNodeThenAdvance = (
	p: Parser,
): ASTNode => {
	if (p.cursor >= p.tokenLength) {
		return {
			kind: ASTNodeKind.END,
		};
	}
	const token = parserGetNextTokenThenAdvance(p);

	if (token.kind === TokenKind.KEYWORD) {
		switch (token.text) {
			case "for":
			case "while":
				return parserBuildLoopFirstNode(p);
			case "do":
				return parserBuildLoopLastNode(p);
			case "if":
				return parseBuildIfElseNode(p);
			default:
				break;
		}
	}

	const node: ASTNodeProcess = {
		kind: ASTNodeKind.PROCESS,
		body: [],
	};

	if (token.kind === TokenKind.SEMICOLON) {
		return node;
	}

	node["body"].push(token);

	let bodyToken: Token;

	while (
		(bodyToken = parserGetNextTokenThenAdvance(p))
			.kind !== TokenKind.SEMICOLON
	) {
		if (bodyToken.kind === TokenKind.END) {
			return node;
		}
		node["body"].push(bodyToken);
	}

	return node;
};
