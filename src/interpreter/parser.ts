import { Token, TokenKind } from "./lexer";

export enum NodeKind {
	EOF = 0,
	ERROR,
	PROCESS,
	LOOP_FIRST,
	LOOP_LAST,
	IF_ELSE,
	FUNC,
}

type NodeEOF = {
	kind: NodeKind.EOF;
};

type NodeError = {
	kind: NodeKind.ERROR;
	rowPos: number;
	colPos: number;
	context: Token;
	reason: string;
};

type NodeProcess = {
	kind: NodeKind.PROCESS;
	body: Token[];
};

type NodeLoopFirst = {
	kind: NodeKind.LOOP_FIRST;
	condition: Token[];
	body: Node[];
};

type NodeLoopLast = {
	kind: NodeKind.LOOP_LAST;
	condition: Token[];
	body: Node[];
};

type NodeIfElse = {
	kind: NodeKind.IF_ELSE;
	condition: Token[];
	bodyIf: Node[];
	bodyElse: Node[];
};

type NodeFunc = {
	kind: NodeKind.FUNC;
	decl: Token[];
	body: Node[];
};

export type Node =
	| NodeEOF
	| NodeProcess
	| NodeLoopFirst
	| NodeLoopLast
	| NodeIfElse
	| NodeFunc
	| NodeEOF
	| NodeError;

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

const parserCollectTokensBetween = (
	p: Parser,
	startToken: TokenKind,
	stopToken: TokenKind,
): Token[] => {
	if (p.cursorPos >= p.tokenLength) {
		return [];
	}
	if (p.tokens[p.cursorPos].kind !== startToken) {
		return [];
	}
	// Consume the start token
	p.cursorPos++;

	// Does not include the start but includes the stop token
	const tokens: Token[] = [];

	let depth = -1;
	let token: Token;
	while (p.cursorPos < p.tokenLength) {
		token = p.tokens[p.cursorPos];
		p.cursorPos++;
		if (token.kind === startToken) {
			depth--;
		}
		if (token.kind === stopToken) {
			depth++;
		}
		tokens.push(token);

		if (depth === 0) {
			break;
		}
	}

	// The cursor is pointing the token immediately after
	// the stop token
	return tokens;
};

const parserSkipWhiteSpace = (
	p: Parser,
): void => {
	while (
		p.cursorPos < p.tokenLength &&
		p.tokens[p.cursorPos].kind ===
			TokenKind.WHITE_SPACE
	) {
		p.cursorPos++;
	}
};

const parserBuildLoopFirstNode = (
	p: Parser,
): NodeLoopFirst | NodeError => {
	const node: NodeLoopFirst = {
		kind: NodeKind.LOOP_FIRST,
		body: [],
		condition: [],
	};

	// Set "for" token as marker
	let markerToken: Token =
		p.tokens[p.cursorPos - 1];

	parserSkipWhiteSpace(p);
	if (
		p.cursorPos >= p.tokenLength ||
		p.tokens[p.cursorPos].kind !==
			TokenKind.LEFT_PAREN
	) {
		return {
			kind: NodeKind.ERROR,
			reason: `Incomplete test-first loop declaration missing "(".`,
			context: markerToken,
			rowPos: markerToken.rowPos,
			colPos: markerToken.colPos + 3,
		};
	}

	// Set "(" token as marker
	markerToken = p.tokens[p.cursorPos];

	node.condition = parserCollectTokensBetween(
		p,
		TokenKind.LEFT_PAREN,
		TokenKind.RIGHT_PAREN,
	);

	// In case that the condition is empty
	// Or the stop token is not found
	if (
		node.condition.length === 0 ||
		node.condition[node.condition.length - 1]
			.kind !== TokenKind.RIGHT_PAREN
	) {
		return {
			kind: NodeKind.ERROR,
			reason: `Incomplete test-first loop declaration. Expected ")".`,
			context: markerToken,
			rowPos: markerToken.rowPos,
			colPos: markerToken.colPos,
		};
	}

	// Set ")" token as marker and consume it with pop()
	// (last element)
	markerToken = node.condition.pop()!;
	parserSkipWhiteSpace(p);
	if (
		p.cursorPos >= p.tokenLength ||
		p.tokens[p.cursorPos].kind !==
			TokenKind.LEFT_CURLY
	) {
		return {
			kind: NodeKind.ERROR,
			reason: `Incomplete test-first loop declaration. Expected "{".`,
			context: markerToken,
			rowPos: markerToken.rowPos,
			colPos: markerToken.colPos,
		};
	}

	// Set "{" token as marker
	markerToken = p.tokens[p.cursorPos];

	const bodyTokens = parserCollectTokensBetween(
		p,
		TokenKind.LEFT_CURLY,
		TokenKind.RIGHT_CURLY,
	);
	// In case that the body is empty
	// Or the stop token is not found
	if (
		bodyTokens.length === 0 ||
		bodyTokens[bodyTokens.length - 1].kind !==
			TokenKind.RIGHT_CURLY
	) {
		return {
			kind: NodeKind.ERROR,
			reason: `Incomplete test-first loop declaration. Expected "}".`,
			context: markerToken,
			rowPos: markerToken.rowPos,
			colPos: markerToken.colPos,
		};
	}

	node.body = parserGetAllNodes(
		parserInit(bodyTokens),
	);

	return node;
};

const parserBuildLoopLastNode = (
	p: Parser,
): NodeLoopLast => {
	const node: NodeLoopLast = {
		kind: NodeKind.LOOP_LAST,
		body: [],
		condition: [],
	};

	parserSkipWhiteSpace(p);
	if (p.cursorPos >= p.tokenLength) {
		return node;
	}
	if (
		p.tokens[p.cursorPos].kind !==
		TokenKind.LEFT_CURLY
	) {
		return node;
	}
	node.body = parserGetAllNodes(
		parserInit(
			parserCollectTokensBetween(
				p,
				TokenKind.LEFT_CURLY,
				TokenKind.RIGHT_CURLY,
			),
		),
	);

	parserSkipWhiteSpace(p);
	if (p.cursorPos >= p.tokenLength) {
		return node;
	}
	if (
		p.tokens[p.cursorPos].kind !==
			TokenKind.KEYWORD ||
		p.tokens[p.cursorPos].text !== "while"
	) {
		return node;
	}
	p.cursorPos++; // consume the "while" keyword

	parserSkipWhiteSpace(p);
	if (p.cursorPos >= p.tokenLength) {
		return node;
	}
	if (
		p.tokens[p.cursorPos].kind !==
		TokenKind.LEFT_PAREN
	) {
		return node;
	}
	node.condition = parserCollectTokensBetween(
		p,
		TokenKind.LEFT_PAREN,
		TokenKind.RIGHT_PAREN,
	);

	parserSkipWhiteSpace(p);

	if (p.cursorPos >= p.tokenLength) {
		return node;
	}
	if (
		p.tokens[p.cursorPos].kind ===
		TokenKind.SEMICOLON
	) {
		p.cursorPos++; // consume the semicolon
	}

	return node;
};

const parserBuildIfElseNode = (
	p: Parser,
): NodeIfElse => {
	const node: NodeIfElse = {
		kind: NodeKind.IF_ELSE,
		condition: [],
		bodyIf: [],
		bodyElse: [],
	};

	parserSkipWhiteSpace(p);

	if (p.cursorPos >= p.tokenLength) {
		return node;
	}
	if (
		p.tokens[p.cursorPos].kind !==
		TokenKind.LEFT_PAREN
	) {
		return node;
	}
	node.condition = parserCollectTokensBetween(
		p,
		TokenKind.LEFT_PAREN,
		TokenKind.RIGHT_PAREN,
	);

	parserSkipWhiteSpace(p);

	if (p.cursorPos >= p.tokenLength) {
		return node;
	}
	if (
		p.tokens[p.cursorPos].kind !==
		TokenKind.LEFT_CURLY
	) {
		return node;
	}
	node.bodyIf = parserGetAllNodes(
		parserInit(
			parserCollectTokensBetween(
				p,
				TokenKind.LEFT_CURLY,
				TokenKind.RIGHT_CURLY,
			),
		),
	);

	parserSkipWhiteSpace(p);

	if (p.cursorPos >= p.tokenLength) {
		return node;
	}
	if (
		p.tokens[p.cursorPos].kind !==
			TokenKind.KEYWORD ||
		p.tokens[p.cursorPos].text !== "else"
	) {
		return node;
	}
	p.cursorPos++; // consume the "else" keyword

	parserSkipWhiteSpace(p);

	if (p.cursorPos >= p.tokenLength) {
		return node;
	}
	if (
		p.tokens[p.cursorPos].kind !==
		TokenKind.LEFT_CURLY
	) {
		return node;
	}
	node.bodyElse = parserGetAllNodes(
		parserInit(
			parserCollectTokensBetween(
				p,
				TokenKind.LEFT_CURLY,
				TokenKind.RIGHT_CURLY,
			),
		),
	);
	return node;
};

const parserGetNextNodeThenAdvance = (
	p: Parser,
): Node => {
	parserSkipWhiteSpace(p);
	if (p.cursorPos >= p.tokenLength) {
		return {
			kind: NodeKind.EOF,
		};
	}
	const token = p.tokens[p.cursorPos];
	p.cursorPos++;
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

	const tokens: Token[] = [token];

	while (
		p.cursorPos < p.tokenLength &&
		p.tokens[p.cursorPos].kind !==
			TokenKind.LEFT_CURLY &&
		p.tokens[p.cursorPos].kind !==
			TokenKind.SEMICOLON
	) {
		tokens.push(p.tokens[p.cursorPos]);
		p.cursorPos++;
	}

	if (
		p.cursorPos >= p.tokenLength ||
		(p.tokens[p.cursorPos].kind !==
			TokenKind.LEFT_CURLY &&
			p.tokens[p.cursorPos].kind !==
				TokenKind.SEMICOLON)
	) {
		const errorToken = tokens[tokens.length - 1];

		return {
			kind: NodeKind.ERROR,
			rowPos: errorToken.rowPos,
			colPos: errorToken.colPos,
			reason:
				"Expected semicolon at the end of process.",
			context: errorToken,
		};
	}

	if (
		p.tokens[p.cursorPos].kind ===
		TokenKind.SEMICOLON
	) {
		p.cursorPos++;
		return {
			kind: NodeKind.PROCESS,
			body: tokens,
		};
	}

	return {
		kind: NodeKind.FUNC,
		decl: tokens,
		body: parserGetAllNodes(
			parserInit(
				parserCollectTokensBetween(
					p,
					TokenKind.LEFT_CURLY,
					TokenKind.RIGHT_CURLY,
				),
			),
		),
	};
};

export const parserGetAllNodes = (
	p: Parser,
): Node[] => {
	const nodes: Node[] = [];
	let node: Node;
	while (
		(node = parserGetNextNodeThenAdvance(p))
			.kind !== NodeKind.EOF
	) {
		nodes.push(node);
	}

	return nodes;
};
