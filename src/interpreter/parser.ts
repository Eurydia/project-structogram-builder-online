import {
	Token,
	TokenKind,
} from "interpreter/lexer";

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
	condition: Token[];
	body: ASTNode[];
};

export type ASTNodeLoopLast = {
	kind: ASTNodeKind.LOOP_LAST;
	condition: Token[];
	body: ASTNode[];
};

export type ASTNodeIfElse = {
	kind: ASTNodeKind.IF_ELSE;
	condition: Token[];
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
	cursorPos: number;
};

export const parserInit = (
	tokens: Token[],
): Parser => {
	return {
		tokens: tokens,
		tokenLength: tokens.length,
		cursorPos: 0,
	};
};

const parserSkipWhiteSpace = (
	p: Parser,
): void => {
	while (p.cursorPos < p.tokenLength) {
		if (
			p.tokens[p.cursorPos].kind !==
			TokenKind.WHITE_SPACE
		) {
			return;
		}
		p.cursorPos++;
	}
};

const parserSafeGetNextTokenThenAdvance = (
	p: Parser,
): Token => {
	if (p.cursorPos >= p.tokenLength) {
		return {
			kind: TokenKind.END,
			text: "",
		};
	}
	const token = p.tokens[p.cursorPos];
	p.cursorPos++;
	return token;
};

const parserBuildLoopFirstNode = (
	p: Parser,
): ASTNodeLoopFirst => {
	const node: ASTNodeLoopFirst = {
		kind: ASTNodeKind.LOOP_FIRST,
		body: [],
		condition: [],
	};

	parserSkipWhiteSpace(p);

	if (
		parserSafeGetNextTokenThenAdvance(p).kind !==
		TokenKind.LEFT_PAREN
	) {
		return node;
	}

	const controlTokens: Token[] = [];
	let controlToken: Token;
	let parenDepth = -1;
	while (
		(controlToken =
			parserSafeGetNextTokenThenAdvance(p))
			.kind !== TokenKind.END
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

	node["condition"] = controlTokens;

	parserSkipWhiteSpace(p);

	if (
		parserSafeGetNextTokenThenAdvance(p).kind !==
		TokenKind.LEFT_CURLY
	) {
		return node;
	}

	const bodyTokens: Token[] = [];
	let bodyToken: Token;
	let curltyDepth = -1;
	while (
		(bodyToken =
			parserSafeGetNextTokenThenAdvance(p))
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

	return node;
};

const parserBuildLoopLastNode = (
	p: Parser,
): ASTNodeLoopLast => {
	const node: ASTNodeLoopLast = {
		kind: ASTNodeKind.LOOP_LAST,
		body: [],
		condition: [],
	};

	parserSkipWhiteSpace(p);

	if (
		parserSafeGetNextTokenThenAdvance(p).kind !==
		TokenKind.LEFT_CURLY
	) {
		return node;
	}

	const bodyTokens: Token[] = [];
	let bodyToken: Token;
	let curlyDepth = -1;
	while (
		(bodyToken =
			parserSafeGetNextTokenThenAdvance(p))
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

	parserSkipWhiteSpace(p);

	if (
		parserSafeGetNextTokenThenAdvance(p).text !==
		"while"
	) {
		return node;
	}

	parserSkipWhiteSpace(p);

	if (
		parserSafeGetNextTokenThenAdvance(p).kind !==
		TokenKind.LEFT_PAREN
	) {
		return node;
	}

	const controlTokens: Token[] = [];
	let controlToken: Token;
	let parenDepth = -1;
	while (
		(controlToken =
			parserSafeGetNextTokenThenAdvance(p))
			.kind !== TokenKind.END
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

	parserSkipWhiteSpace(p);

	if (
		parserSafeGetNextTokenThenAdvance(p).kind !==
		TokenKind.SEMICOLON
	) {
		return node;
	}

	node["condition"] = controlTokens;

	return node;
};

const parserBuildIfElseNode = (
	p: Parser,
): ASTNodeIfElse => {
	const node: ASTNodeIfElse = {
		kind: ASTNodeKind.IF_ELSE,
		condition: [],
		bodyIf: [],
		bodyElse: [],
	};

	parserSkipWhiteSpace(p);

	if (
		parserSafeGetNextTokenThenAdvance(p).kind !==
		TokenKind.LEFT_PAREN
	) {
		return node;
	}

	const controlTokens: Token[] = [];
	let controlToken: Token;
	let parenDepth = -1;
	while (
		(controlToken =
			parserSafeGetNextTokenThenAdvance(p))
			.kind !== TokenKind.END
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

	node["condition"] = controlTokens;

	parserSkipWhiteSpace(p);

	if (
		parserSafeGetNextTokenThenAdvance(p).kind !==
		TokenKind.LEFT_CURLY
	) {
		return node;
	}

	const bodyIfTokens: Token[] = [];
	let bodyIfToken: Token;
	let curlyDepth = -1;
	while (
		(bodyIfToken =
			parserSafeGetNextTokenThenAdvance(p))
			.kind !== TokenKind.END
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

	node["bodyIf"] = bodyIfNodes;

	parserSkipWhiteSpace(p);

	if (
		parserSafeGetNextTokenThenAdvance(p).text !==
		"else"
	) {
		return node;
	}

	parserSkipWhiteSpace(p);

	if (
		parserSafeGetNextTokenThenAdvance(p).kind !==
		TokenKind.LEFT_CURLY
	) {
		return node;
	}

	const bodyElseTokens: Token[] = [];
	let bodyElseToken: Token;
	curlyDepth = -1;
	while (
		(bodyElseToken =
			parserSafeGetNextTokenThenAdvance(p))
			.kind !== TokenKind.END
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

	const bodyElseParser = parserInit(
		bodyElseTokens,
	);
	const bodyElseNodes: ASTNode[] = [];
	let bodyElseNode: ASTNode;
	while (
		(bodyElseNode = parserGetNextNodeThenAdvance(
			bodyElseParser,
		)).kind !== ASTNodeKind.END
	) {
		bodyElseNodes.push(bodyElseNode);
	}

	node["bodyElse"] = bodyElseNodes;
	return node;
};

export const parserGetNextNodeThenAdvance = (
	p: Parser,
): ASTNode => {
	if (p.cursorPos >= p.tokenLength) {
		return {
			kind: ASTNodeKind.END,
		};
	}

	parserSkipWhiteSpace(p);

	const token =
		parserSafeGetNextTokenThenAdvance(p);

	if (token.kind === TokenKind.KEYWORD) {
		switch (token.text) {
			case "for":
			case "while":
				return parserBuildLoopFirstNode(p);
			case "do":
				return parserBuildLoopLastNode(p);
			case "if":
				return parserBuildIfElseNode(p);
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
		(bodyToken =
			parserSafeGetNextTokenThenAdvance(p))
			.kind !== TokenKind.SEMICOLON
	) {
		if (bodyToken.kind === TokenKind.END) {
			return node;
		}
		node["body"].push(bodyToken);
	}

	return node;
};

export const parserGetAllNodes = (
	p: Parser,
): ASTNode[] => {
	const nodes: ASTNode[] = [];
	let node: ASTNode;
	while (
		(node = parserGetNextNodeThenAdvance(p))
			.kind !== ASTNodeKind.END
	) {
		nodes.push(node);
	}

	return nodes;
};
