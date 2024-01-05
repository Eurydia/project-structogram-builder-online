import { Token, TokenKind } from "./lexer";

export enum NodeKind {
	END,
	PROCESS,
	LOOP_FIRST,
	LOOP_LAST,
	IF_ELSE,
}

export type NodeEnd = {
	kind: NodeKind.END;
};

export type NodeProcess = {
	kind: NodeKind.PROCESS;
	body: Token[];
};

export type NodeLoopFirst = {
	kind: NodeKind.LOOP_FIRST;
	condition: Token[];
	body: Node[];
};

export type NodeLoopLast = {
	kind: NodeKind.LOOP_LAST;
	condition: Token[];
	body: Node[];
};

export type NodeIfElse = {
	kind: NodeKind.IF_ELSE;
	condition: Token[];
	bodyIf: Node[];
	bodyElse: Node[];
};

export type Node =
	| NodeEnd
	| NodeProcess
	| NodeLoopFirst
	| NodeLoopLast
	| NodeIfElse;

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

const parserCollectTokens = (
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
	p.cursorPos++;
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
		if (depth === 0) {
			break;
		}
		tokens.push(token);
	}
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
): NodeLoopFirst => {
	const node: NodeLoopFirst = {
		kind: NodeKind.LOOP_FIRST,
		body: [],
		condition: [],
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

	node.condition = parserCollectTokens(
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

	node.body = parserGetAllNodes(
		parserInit(
			parserCollectTokens(
				p,
				TokenKind.LEFT_CURLY,
				TokenKind.RIGHT_CURLY,
			),
		),
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
			parserCollectTokens(
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
	node.condition = parserCollectTokens(
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
	node.condition = parserCollectTokens(
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
			parserCollectTokens(
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
			parserCollectTokens(
				p,
				TokenKind.LEFT_CURLY,
				TokenKind.RIGHT_CURLY,
			),
		),
	);
	return node;
};

export const parserGetNextNodeThenAdvance = (
	p: Parser,
): Node => {
	parserSkipWhiteSpace(p);

	if (p.cursorPos >= p.tokenLength) {
		return {
			kind: NodeKind.END,
		};
	}

	let token = p.tokens[p.cursorPos];
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

	const node: NodeProcess = {
		kind: NodeKind.PROCESS,
		body: [],
	};

	if (token.kind === TokenKind.SEMICOLON) {
		return node;
	}

	node.body.push(token);

	while (p.cursorPos < p.tokenLength) {
		token = p.tokens[p.cursorPos];
		p.cursorPos++;
		if (
			token.kind === TokenKind.END ||
			token.kind === TokenKind.SEMICOLON
		) {
			break;
		}
		node.body.push(token);
	}

	return node;
};

export const parserGetAllNodes = (
	p: Parser,
): Node[] => {
	const nodes: Node[] = [];
	let node: Node;
	while (
		(node = parserGetNextNodeThenAdvance(p))
			.kind !== NodeKind.END
	) {
		nodes.push(node);
	}

	return nodes;
};
