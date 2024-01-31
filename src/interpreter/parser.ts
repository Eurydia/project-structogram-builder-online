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
	context: string;
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
	// If the cursor is out of bound, "(" token is missing
	if (p.cursorPos >= p.tokenLength) {
		return {
			kind: NodeKind.ERROR,
			reason: `Incomplete test-first loop declaration. Missing a "(" token.`,
			context: markerToken.text,
			rowPos: markerToken.rowPos,
			colPos: markerToken.colPos,
		};
	}
	// The first non-whitespace found is not a "(" token
	// but something else
	if (
		p.tokens[p.cursorPos].kind !==
		TokenKind.LEFT_PAREN
	) {
		const unexpectedToken = p.tokens[p.cursorPos];

		return {
			kind: NodeKind.ERROR,
			reason: `Unexpected token found in test-first loop declaration. Expected a "(" token but found "${unexpectedToken.text}" instead.`,
			context: `${markerToken.text} ${unexpectedToken.text}`,
			rowPos: unexpectedToken.rowPos,
			colPos: unexpectedToken.colPos,
		};
	}
	// Set "(" token as marker
	markerToken = p.tokens[p.cursorPos];

	node.condition = parserCollectTokensBetween(
		p,
		TokenKind.LEFT_PAREN,
		TokenKind.RIGHT_PAREN,
	);
	// If the condition has at least one element,
	// set the last token token as marker
	// Otherwise, keep  "(" token as marker
	if (node.condition.length > 0) {
		markerToken =
			node.condition[node.condition.length - 1];
	}
	// If the condition is empty, the ")" token is missing
	// Or the condition is not empty but ")" is not found
	if (
		node.condition.length === 0 ||
		markerToken.kind !== TokenKind.RIGHT_PAREN
	) {
		return {
			kind: NodeKind.ERROR,
			reason: `Incomplete test-first loop declaration. Missing a ")" token.`,
			context: markerToken.text,
			rowPos: markerToken.rowPos,
			colPos: markerToken.colPos,
		};
	}
	// Consume ")" token from condition
	node.condition.pop();
	// Bu this point, ")" token is the marker
	parserSkipWhiteSpace(p);
	// If the cursor is out of bound, "{" token is missing
	if (p.cursorPos >= p.tokenLength) {
		return {
			kind: NodeKind.ERROR,
			reason: `Incomplete test-first loop declaration. Expected a "{" token.`,
			context: markerToken.text,
			rowPos: markerToken.rowPos,
			colPos: markerToken.colPos,
		};
	}
	// The first non-whitespace found is not a "{" token
	// but something else
	if (
		p.tokens[p.cursorPos].kind !==
		TokenKind.LEFT_CURLY
	) {
		const unexpectedToken = p.tokens[p.cursorPos];

		return {
			kind: NodeKind.ERROR,
			reason: `Unexpected token found in test-first loop declaration. Expected a "{" token but found "${unexpectedToken.text}" instead.`,
			context: `${markerToken.text} ${unexpectedToken.text}`,
			rowPos: unexpectedToken.rowPos,
			colPos: unexpectedToken.colPos,
		};
	}
	// Set "{" token as marker
	markerToken = p.tokens[p.cursorPos];

	const bodyTokens = parserCollectTokensBetween(
		p,
		TokenKind.LEFT_CURLY,
		TokenKind.RIGHT_CURLY,
	);

	// If body has at least one token,
	// set the last token as marker .
	// If body has no token, keep "{" as marker
	if (bodyTokens.length > 0) {
		markerToken =
			bodyTokens[bodyTokens.length - 1];
	}
	// If the body has no token, the declaration is incomplete
	// Or the body has tokens, but "}" is not found
	if (
		bodyTokens.length === 0 ||
		markerToken.kind !== TokenKind.RIGHT_CURLY
	) {
		return {
			kind: NodeKind.ERROR,
			reason: `Incomplete test-first loop declaration. Expected "}" token.`,
			context: markerToken.text,
			rowPos: markerToken.rowPos,
			colPos: markerToken.colPos,
		};
	}
	// Consume "}" token from body
	bodyTokens.pop();

	node.body = parserGetAllNodes(
		parserInit(bodyTokens),
	);

	return node;
};

const parserBuildLoopLastNode = (
	p: Parser,
): NodeLoopLast | NodeError => {
	const node: NodeLoopLast = {
		kind: NodeKind.LOOP_LAST,
		body: [],
		condition: [],
	};

	// Set "do" token as marker
	let markerToken = p.tokens[p.cursorPos - 1];

	parserSkipWhiteSpace(p);
	// If the cursor is out of bound, "{" token is missing
	if (p.cursorPos >= p.tokenLength) {
		return {
			kind: NodeKind.ERROR,
			reason: `Incomplete test-last loop declaration. Expected a "{" token.`,
			context: markerToken.text,
			rowPos: markerToken.rowPos,
			colPos: markerToken.colPos,
		};
	}
	// The first non-whitespace found is not a "{" token
	// but something else
	if (
		p.tokens[p.cursorPos].kind !==
		TokenKind.LEFT_CURLY
	) {
		const unexpectedToken = p.tokens[p.cursorPos];
		return {
			kind: NodeKind.ERROR,
			reason: `Unexpected token found in test-last loop declaration. Expected a "{" token but found "${unexpectedToken.text}" instead.`,
			context: `${markerToken.text} ${unexpectedToken.text}`,
			rowPos: unexpectedToken.rowPos,
			colPos: unexpectedToken.colPos,
		};
	}
	// Set "{" token as marker
	markerToken = p.tokens[p.cursorPos];

	const bodyTokens = parserCollectTokensBetween(
		p,
		TokenKind.LEFT_CURLY,
		TokenKind.RIGHT_CURLY,
	);

	// If body has at least one token,
	// set the last token as marker and consume it.
	// If body has no token, keep "{" as marker
	if (bodyTokens.length > 0) {
		markerToken =
			bodyTokens[bodyTokens.length - 1];
	}
	// If the body has no token, the declaration is incomplete
	// Or the body has tokens, but "}" is not found
	if (
		bodyTokens.length === 0 ||
		markerToken.kind !== TokenKind.RIGHT_CURLY
	) {
		return {
			kind: NodeKind.ERROR,
			reason: `Incomplete test-last loop declaration. Expected "}" token.`,
			context: markerToken.text,
			rowPos: markerToken.rowPos,
			colPos: markerToken.colPos,
		};
	}
	// Consume the "}" token in body
	bodyTokens.pop();
	// By this point, the marker is "}" token
	parserSkipWhiteSpace(p);
	// If the cursor is out of bound, "while" token is missing
	if (p.cursorPos >= p.tokenLength) {
		return {
			kind: NodeKind.ERROR,
			reason: `Incomplete test-last loop declaration. Expected a "while" token.`,
			context: markerToken.text,
			rowPos: markerToken.rowPos,
			colPos: markerToken.colPos,
		};
	}
	// The first non-whitespace found after "}" is not a "while" token
	// but something else
	if (
		p.tokens[p.cursorPos].kind !==
			TokenKind.KEYWORD ||
		p.tokens[p.cursorPos].text !== "while"
	) {
		const unexpectedToken = p.tokens[p.cursorPos];
		return {
			kind: NodeKind.ERROR,
			reason: `Unexpected token found in test-last loop declaration. Expected a "while" token but found "${unexpectedToken.text}" instead.`,
			context: `${markerToken.text} ${unexpectedToken.text}`,
			rowPos: unexpectedToken.rowPos,
			colPos: unexpectedToken.colPos,
		};
	}
	// Set "while" token as marker
	markerToken = p.tokens[p.cursorPos];
	// Consume "while token"
	p.cursorPos++;
	parserSkipWhiteSpace(p);
	// If the cursor is out of bound, "(" token is missing
	if (p.cursorPos >= p.tokenLength) {
		return {
			kind: NodeKind.ERROR,
			reason: `Incomplete test-last loop declaration. Missing a "(" token.`,
			context: markerToken.text,
			rowPos: markerToken.rowPos,
			colPos: markerToken.colPos,
		};
	}
	// The first non-whitespace found is not a "(" token
	// but something else
	if (
		p.tokens[p.cursorPos].kind !==
		TokenKind.LEFT_PAREN
	) {
		const unexpectedToken = p.tokens[p.cursorPos];
		return {
			kind: NodeKind.ERROR,
			reason: `Unexpected token found in test-first loop declaration. Expected a "(" token but found "${unexpectedToken.text}" instead.`,
			context: `${markerToken.text} ${unexpectedToken.text}`,
			rowPos: unexpectedToken.rowPos,
			colPos: unexpectedToken.colPos,
		};
	}
	// Set "(" token as marker
	markerToken = p.tokens[p.cursorPos];

	node.condition = parserCollectTokensBetween(
		p,
		TokenKind.LEFT_PAREN,
		TokenKind.RIGHT_PAREN,
	);
	// If the condition has at least one element,
	// set the last token token as marker
	// Otherwise, keep  "(" token as marker
	if (node.condition.length > 0) {
		markerToken =
			node.condition[node.condition.length - 1];
	}
	// If the condition is empty, the ")" token is missing
	// Or the condition is not empty but ")" is not found
	if (
		node.condition.length === 0 ||
		markerToken.kind !== TokenKind.RIGHT_PAREN
	) {
		return {
			kind: NodeKind.ERROR,
			reason: `Incomplete test-first loop declaration. Missing a ")" token.`,
			context: markerToken.text,
			rowPos: markerToken.rowPos,
			colPos: markerToken.colPos,
		};
	}
	// Consume ")" token from condition
	node.condition.pop();
	// At this point, ")" is the marker
	parserSkipWhiteSpace(p);
	// If the cursor is out of bound, ";" token is missing
	if (p.cursorPos >= p.tokenLength) {
		return {
			kind: NodeKind.ERROR,
			reason: `Incomplete test-last loop declaration. Missing a ";" token.`,
			context: markerToken.text,
			rowPos: markerToken.rowPos,
			colPos: markerToken.colPos,
		};
	}
	// The first non-whitespace found after ")" is not a ";" token
	// but something else
	if (
		p.tokens[p.cursorPos].kind !==
		TokenKind.SEMICOLON
	) {
		const unexpectedToken = p.tokens[p.cursorPos];
		return {
			kind: NodeKind.ERROR,
			reason: `Unexpected token found in test-first loop declaration. Expected a ";" token but found "${unexpectedToken.text}" instead.`,
			context: `${markerToken.text} ${unexpectedToken.text}`,
			rowPos: unexpectedToken.rowPos,
			colPos: unexpectedToken.colPos,
		};
	}
	// Consume semicolon token
	p.cursorPos++;

	// Only build the body nodes if the parent declaration is correct
	node.body = parserGetAllNodes(
		parserInit(bodyTokens),
	);
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
	let markerToken = token;

	// Consume tokens until ";" or "{" token is found
	while (
		p.cursorPos < p.tokenLength &&
		p.tokens[p.cursorPos].kind !==
			TokenKind.SEMICOLON &&
		p.tokens[p.cursorPos].kind !==
			TokenKind.LEFT_CURLY
	) {
		markerToken = p.tokens[p.cursorPos];
		tokens.push(p.tokens[p.cursorPos]);
		p.cursorPos++;
	}

	// Neither ";" or "{" token is found
	// The loop terminates becaues EOF
	// Also assumed that the use ris trying to write a process
	// instead of a function
	if (
		p.cursorPos >= p.tokenLength ||
		(p.tokens[p.cursorPos].kind !==
			TokenKind.LEFT_CURLY &&
			p.tokens[p.cursorPos].kind !==
				TokenKind.SEMICOLON)
	) {
		return {
			kind: NodeKind.ERROR,
			rowPos: markerToken.rowPos,
			colPos: markerToken.colPos,
			reason:
				"Expected semicolon at the end of process.",
			context: markerToken.text,
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

	// It is confirmed that the loop stopped
	// because it encountered a "{" token
	// Set it as marker
	markerToken = p.tokens[p.cursorPos];

	const bodyTokens = parserCollectTokensBetween(
		p,
		TokenKind.LEFT_CURLY,
		TokenKind.RIGHT_CURLY,
	);

	// If the condition has at least one element,
	// set the last token token as marker
	// Otherwise, keep  "{" token as marker
	if (bodyTokens.length > 0) {
		markerToken =
			bodyTokens[bodyTokens.length - 1];
	}
	// If the condition is empty, the "}" token is missing
	// Or the condition is not empty but "}" is not found
	if (
		bodyTokens.length === 0 ||
		markerToken.kind !== TokenKind.RIGHT_CURLY
	) {
		return {
			kind: NodeKind.ERROR,
			reason: `Incomplete test-first loop declaration. Missing a "}" token.`,
			context: markerToken.text,
			rowPos: markerToken.rowPos,
			colPos: markerToken.colPos,
		};
	}
	// Consume the "}" token from body
	bodyTokens.pop();

	return {
		kind: NodeKind.FUNC,
		decl: tokens,
		body: parserGetAllNodes(
			parserInit(bodyTokens),
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
		if (node.kind === NodeKind.ERROR) {
			break;
		}
	}

	return nodes;
};
