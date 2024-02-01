import {
	DiagramToken,
	DiagramTokenKind,
} from "./lexer";

export enum DiagramNodeKind {
	EOF = 0,
	ERROR,
	PROCESS,
	LOOP_FIRST,
	LOOP_LAST,
	IF_ELSE,
	FUNCTION,
}

type DiagramNodeEOF = {
	kind: DiagramNodeKind.EOF;
};

type DiagramNodeError = {
	kind: DiagramNodeKind.ERROR;
	caretOffset: number;
	lineNumber: number;
	charNumber: number;
	context: string;
	reason: string;
};

type DiagramNodeProcess = {
	kind: DiagramNodeKind.PROCESS;
	body: DiagramToken[];
};

type DiagramNodeLoopFirst = {
	kind: DiagramNodeKind.LOOP_FIRST;
	condition: DiagramToken[];
	body: Node[];
};

type DiagramNodeLoopLast = {
	kind: DiagramNodeKind.LOOP_LAST;
	condition: DiagramToken[];
	body: Node[];
};

type DiagramNodeIfElse = {
	kind: DiagramNodeKind.IF_ELSE;
	condition: DiagramToken[];
	bodyIf: Node[];
	bodyElse: Node[];
};

type DiagramNodeFunction = {
	kind: DiagramNodeKind.FUNCTION;
	declaration: DiagramToken[];
	body: Node[];
};

export type Node =
	| DiagramNodeEOF
	| DiagramNodeProcess
	| DiagramNodeLoopFirst
	| DiagramNodeLoopLast
	| DiagramNodeIfElse
	| DiagramNodeFunction
	| DiagramNodeEOF
	| DiagramNodeError;

export type Parser = {
	tokens: DiagramToken[];
	tokenLength: number;
	cursorPos: number;
};

export const parserInit = (
	tokens: DiagramToken[],
): Parser => {
	return {
		tokens: tokens,
		tokenLength: tokens.length,
		cursorPos: 0,
	};
};

const parserCollectTokensBetween = (
	p: Parser,
	startToken: DiagramTokenKind,
	stopToken: DiagramTokenKind,
): DiagramToken[] => {
	if (p.cursorPos >= p.tokenLength) {
		return [];
	}
	if (p.tokens[p.cursorPos].kind !== startToken) {
		return [];
	}
	// Consume the start token
	p.cursorPos++;

	// Does not include the start but includes the stop token
	const tokens: DiagramToken[] = [];

	let depth = -1;
	let token: DiagramToken;
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
			DiagramTokenKind.WHITE_SPACE
	) {
		p.cursorPos++;
	}
};

const parserBuildLoopFirstNode = (
	p: Parser,
): DiagramNodeLoopFirst | DiagramNodeError => {
	const node: DiagramNodeLoopFirst = {
		kind: DiagramNodeKind.LOOP_FIRST,
		body: [],
		condition: [],
	};

	// Set "for" token as marker
	let markerToken: DiagramToken =
		p.tokens[p.cursorPos - 1];
	parserSkipWhiteSpace(p);
	// If the cursor is out of bound, "(" token is missing
	if (p.cursorPos >= p.tokenLength) {
		const { text, lineNumber, charNumber } =
			markerToken;
		return {
			kind: DiagramNodeKind.ERROR,
			reason: `Incomplete test-first loop declaration. Missing a "(" token.`,
			context: text,
			caretOffset: text.length,
			lineNumber,
			charNumber,
		};
	}
	// The first non-whitespace found is not a "(" token
	// but something else
	if (
		p.tokens[p.cursorPos].kind !==
		DiagramTokenKind.LEFT_PAREN
	) {
		const { text: markerTokenText } = markerToken;
		const {
			text: errorTokenText,
			lineNumber,
			charNumber,
		} = p.tokens[p.cursorPos];
		return {
			kind: DiagramNodeKind.ERROR,
			reason: `Unexpected token found in test-first loop declaration. Expected a "(" token but found "${errorTokenText}" instead.`,
			context: `${markerTokenText} ${errorTokenText}`,
			caretOffset: markerTokenText.length + 1,
			lineNumber,
			charNumber,
		};
	}
	// Set "(" token as marker
	markerToken = p.tokens[p.cursorPos];

	node.condition = parserCollectTokensBetween(
		p,
		DiagramTokenKind.LEFT_PAREN,
		DiagramTokenKind.RIGHT_PAREN,
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
		markerToken.kind !==
			DiagramTokenKind.RIGHT_PAREN
	) {
		const { text, lineNumber, charNumber } =
			markerToken;
		return {
			kind: DiagramNodeKind.ERROR,
			reason: `Incomplete test-first loop declaration. Missing a ")" token.`,
			context: text,
			caretOffset: text.length,
			lineNumber,
			charNumber,
		};
	}
	// Consume ")" token from condition
	node.condition.pop();
	// By this point, ")" token is the marker
	parserSkipWhiteSpace(p);
	// If the cursor is out of bound, "{" token is missing
	if (p.cursorPos >= p.tokenLength) {
		const { text, lineNumber, charNumber } =
			markerToken;
		return {
			kind: DiagramNodeKind.ERROR,
			reason: `Incomplete test-first loop declaration. Missing a "{" token.`,
			context: text,
			caretOffset: text.length,
			lineNumber,
			charNumber,
		};
	}
	// The first non-whitespace found is not a "{" token
	// but something else
	if (
		p.tokens[p.cursorPos].kind !==
		DiagramTokenKind.LEFT_CURLY
	) {
		const { text: markerTokenText } = markerToken;
		const {
			text: errorTokenText,
			lineNumber,
			charNumber,
		} = p.tokens[p.cursorPos];
		return {
			kind: DiagramNodeKind.ERROR,
			reason: `Unexpected token found in test-first loop declaration. Expected a "{" token but found "${errorTokenText}" instead.`,
			context: `${markerTokenText} ${errorTokenText}`,
			caretOffset: markerTokenText.length + 1,
			lineNumber,
			charNumber,
		};
	}
	// Set "{" token as marker
	markerToken = p.tokens[p.cursorPos];

	const bodyTokens = parserCollectTokensBetween(
		p,
		DiagramTokenKind.LEFT_CURLY,
		DiagramTokenKind.RIGHT_CURLY,
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
		markerToken.kind !==
			DiagramTokenKind.RIGHT_CURLY
	) {
		const { text, lineNumber, charNumber } =
			markerToken;
		return {
			kind: DiagramNodeKind.ERROR,
			reason: `Incomplete test-first loop declaration. Missing a "}" token.`,
			context: text,
			caretOffset: text.length,
			lineNumber,
			charNumber,
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
): DiagramNodeLoopLast | DiagramNodeError => {
	const node: DiagramNodeLoopLast = {
		kind: DiagramNodeKind.LOOP_LAST,
		body: [],
		condition: [],
	};

	// Set "do" token as marker
	let markerToken = p.tokens[p.cursorPos - 1];

	parserSkipWhiteSpace(p);
	// If the cursor is out of bound, "{" token is missing
	if (p.cursorPos >= p.tokenLength) {
		const { text, lineNumber, charNumber } =
			markerToken;
		return {
			kind: DiagramNodeKind.ERROR,
			reason: `Incomplete test-last loop declaration. Missing a "{" token.`,
			context: text,
			caretOffset: text.length,
			lineNumber,
			charNumber,
		};
	}
	// The first non-whitespace found is not a "{" token
	// but something else
	if (
		p.tokens[p.cursorPos].kind !==
		DiagramTokenKind.LEFT_CURLY
	) {
		const { text: markerTokenText } = markerToken;
		const {
			text: errorTokenText,
			lineNumber,
			charNumber,
		} = p.tokens[p.cursorPos];
		return {
			kind: DiagramNodeKind.ERROR,
			reason: `Unexpected token found in test-last loop declaration. Expected a "{" token but found "${errorTokenText}" instead.`,
			context: `${markerTokenText} ${errorTokenText}`,
			caretOffset: markerTokenText.length + 1,
			lineNumber,
			charNumber,
		};
	}
	// Set "{" token as marker
	markerToken = p.tokens[p.cursorPos];

	const bodyTokens = parserCollectTokensBetween(
		p,
		DiagramTokenKind.LEFT_CURLY,
		DiagramTokenKind.RIGHT_CURLY,
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
		markerToken.kind !==
			DiagramTokenKind.RIGHT_CURLY
	) {
		const { text, lineNumber, charNumber } =
			markerToken;
		return {
			kind: DiagramNodeKind.ERROR,
			reason: `Incomplete test-last loop declaration. Missing "}" token.`,
			context: text,
			caretOffset: text.length + 1,
			lineNumber,
			charNumber,
		};
	}
	// Consume the "}" token in body
	bodyTokens.pop();
	// By this point, the marker is "}" token
	parserSkipWhiteSpace(p);
	// If the cursor is out of bound, "while" token is missing
	if (p.cursorPos >= p.tokenLength) {
		const { text, lineNumber, charNumber } =
			markerToken;
		return {
			kind: DiagramNodeKind.ERROR,
			reason: `Incomplete test-last loop declaration. Missing a "while" token.`,
			context: text,
			caretOffset: text.length + 1,
			lineNumber,
			charNumber,
		};
	}
	// The first non-whitespace found after "}" is not a "while" token
	// but something else
	if (
		p.tokens[p.cursorPos].kind !==
			DiagramTokenKind.KEYWORD ||
		p.tokens[p.cursorPos].text !== "while"
	) {
		const { text: markerTokenText } = markerToken;
		const {
			text: errorTokenText,
			lineNumber,
			charNumber,
		} = p.tokens[p.cursorPos];
		return {
			kind: DiagramNodeKind.ERROR,
			reason: `Unexpected token found in test-last loop declaration. Expected a "while" token but found "${errorTokenText}" instead.`,
			context: `${markerTokenText} ${errorTokenText}`,
			caretOffset: markerTokenText.length + 1,
			lineNumber,
			charNumber,
		};
	}
	// Set "while" token as marker
	markerToken = p.tokens[p.cursorPos];
	// Consume "while token"
	p.cursorPos++;
	parserSkipWhiteSpace(p);
	// If the cursor is out of bound, "(" token is missing
	if (p.cursorPos >= p.tokenLength) {
		const { text, lineNumber, charNumber } =
			markerToken;
		return {
			kind: DiagramNodeKind.ERROR,
			reason: `Incomplete test-last loop declaration. Missing a "(" token.`,
			context: text,
			caretOffset: text.length + 1,
			lineNumber,
			charNumber,
		};
	}
	// The first non-whitespace found is not a "(" token
	// but something else
	if (
		p.tokens[p.cursorPos].kind !==
		DiagramTokenKind.LEFT_PAREN
	) {
		const { text: markerTokenText } = markerToken;
		const {
			text: errorTokenText,
			lineNumber,
			charNumber,
		} = p.tokens[p.cursorPos];
		return {
			kind: DiagramNodeKind.ERROR,
			reason: `Unexpected token found in test-last loop declaration. Expected a "(" token but found "${errorTokenText}" instead.`,
			context: `${markerTokenText} ${errorTokenText}`,
			caretOffset: markerTokenText.length + 1,
			lineNumber,
			charNumber,
		};
	}
	// Set "(" token as marker
	markerToken = p.tokens[p.cursorPos];

	node.condition = parserCollectTokensBetween(
		p,
		DiagramTokenKind.LEFT_PAREN,
		DiagramTokenKind.RIGHT_PAREN,
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
		markerToken.kind !==
			DiagramTokenKind.RIGHT_PAREN
	) {
		const { text, lineNumber, charNumber } =
			markerToken;
		return {
			kind: DiagramNodeKind.ERROR,
			reason: `Incomplete test-last loop declaration. Missing a ")" token.`,
			context: text,
			caretOffset: text.length,
			lineNumber,
			charNumber,
		};
	}
	// Consume ")" token from condition
	node.condition.pop();
	// At this point, ")" is the marker
	parserSkipWhiteSpace(p);
	// If the cursor is out of bound, ";" token is missing
	if (p.cursorPos >= p.tokenLength) {
		const { text, lineNumber, charNumber } =
			markerToken;
		return {
			kind: DiagramNodeKind.ERROR,
			reason: `Incomplete test-last loop declaration. Missing a ";" token.`,
			context: text,
			caretOffset: text.length,
			lineNumber,
			charNumber,
		};
	}
	// The first non-whitespace found after ")" is not a ";" token
	// but something else
	if (
		p.tokens[p.cursorPos].kind !==
		DiagramTokenKind.SEMICOLON
	) {
		const { text: markerTokenText } = markerToken;
		const {
			text: errorTokenText,
			lineNumber,
			charNumber,
		} = p.tokens[p.cursorPos];
		return {
			kind: DiagramNodeKind.ERROR,
			reason: `Unexpected token found in test-last loop declaration. Expected a ";" token but found "${errorTokenText}" instead.`,
			context: `${markerTokenText} ${errorTokenText}`,
			caretOffset: markerTokenText.length + 1,
			lineNumber,
			charNumber,
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
): DiagramNodeIfElse | DiagramNodeError => {
	const node: DiagramNodeIfElse = {
		kind: DiagramNodeKind.IF_ELSE,
		condition: [],
		bodyIf: [],
		bodyElse: [],
	};
	// Set "for" token as marker
	let markerToken: DiagramToken =
		p.tokens[p.cursorPos - 1];
	parserSkipWhiteSpace(p);
	// If the cursor is out of bound, "(" token is missing
	if (p.cursorPos >= p.tokenLength) {
		const { text, lineNumber, charNumber } =
			markerToken;
		return {
			kind: DiagramNodeKind.ERROR,
			reason: `Incomplete branching block (if) declaration. Missing a "(" token.`,
			context: text,
			caretOffset: text.length,
			lineNumber,
			charNumber,
		};
	}
	// The first non-whitespace found is not a "(" token
	// but something else
	if (
		p.tokens[p.cursorPos].kind !==
		DiagramTokenKind.LEFT_PAREN
	) {
		const { text: markerTokenText } = markerToken;
		const {
			text: errorTokenText,
			lineNumber,
			charNumber,
		} = p.tokens[p.cursorPos];
		return {
			kind: DiagramNodeKind.ERROR,
			reason: `Unexpected token found in branching block (if) declaration. Expected a "(" token but found "${errorTokenText}" instead.`,
			context: `${markerTokenText} ${errorTokenText}`,
			caretOffset: markerTokenText.length + 1,
			lineNumber,
			charNumber,
		};
	}
	// Set "(" token as marker
	markerToken = p.tokens[p.cursorPos];
	node.condition = parserCollectTokensBetween(
		p,
		DiagramTokenKind.LEFT_PAREN,
		DiagramTokenKind.RIGHT_PAREN,
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
		markerToken.kind !==
			DiagramTokenKind.RIGHT_PAREN
	) {
		const { text, lineNumber, charNumber } =
			markerToken;
		return {
			kind: DiagramNodeKind.ERROR,
			reason: `Incomplete branching block (if) declaration. Missing a ")" token.`,
			context: text,
			caretOffset: text.length,
			lineNumber,
			charNumber,
		};
	}
	// Consume ")" token from condition
	node.condition.pop();
	// By this point, ")" token is the marker
	parserSkipWhiteSpace(p);
	// If the cursor is out of bound, "{" token is missing
	if (p.cursorPos >= p.tokenLength) {
		const { text, lineNumber, charNumber } =
			markerToken;
		return {
			kind: DiagramNodeKind.ERROR,
			reason: `Incomplete branching block (if) declaration. Missing a "{" token.`,
			context: text,
			caretOffset: text.length,
			lineNumber,
			charNumber,
		};
	}
	// The first non-whitespace found is not a "{" token
	// but something else
	if (
		p.tokens[p.cursorPos].kind !==
		DiagramTokenKind.LEFT_CURLY
	) {
		const { text: markerTokenText } = markerToken;
		const {
			text: errorTokenText,
			lineNumber,
			charNumber,
		} = p.tokens[p.cursorPos];
		return {
			kind: DiagramNodeKind.ERROR,
			reason: `Unexpected token found in branching block (if) declaration. Expected a "{" token but found "${errorTokenText}" instead.`,
			context: `${markerTokenText} ${errorTokenText}`,
			caretOffset: markerTokenText.length + 1,
			lineNumber,
			charNumber,
		};
	}
	// Set "{" token as marker
	markerToken = p.tokens[p.cursorPos];

	const bodyIfTokens = parserCollectTokensBetween(
		p,
		DiagramTokenKind.LEFT_CURLY,
		DiagramTokenKind.RIGHT_CURLY,
	);
	// If body has at least one token,
	// set the last token as marker .
	// If body has no token, keep "{" as marker
	if (bodyIfTokens.length > 0) {
		markerToken =
			bodyIfTokens[bodyIfTokens.length - 1];
	}
	// If the body has no token, the declaration is incomplete
	// Or the body has tokens, but "}" is not found
	if (
		bodyIfTokens.length === 0 ||
		markerToken.kind !==
			DiagramTokenKind.RIGHT_CURLY
	) {
		const { text, lineNumber, charNumber } =
			markerToken;
		return {
			kind: DiagramNodeKind.ERROR,
			reason: `Incomplete branching block (if) declaration. Missing a "}" token.`,
			context: text,
			caretOffset: text.length,
			lineNumber,
			charNumber,
		};
	}
	// Consume "}" token from body
	bodyIfTokens.pop();
	// Only parse the body after the declaration is valid
	// the body of if branch has to be parsed here
	// before possible return
	node.bodyIf = parserGetAllNodes(
		parserInit(bodyIfTokens),
	);
	parserSkipWhiteSpace(p);
	// The branching block is complete
	// No need for error at this point
	if (
		p.cursorPos >= p.tokenLength ||
		p.tokens[p.cursorPos].kind !==
			DiagramTokenKind.KEYWORD ||
		p.tokens[p.cursorPos].text !== "else"
	) {
		return node;
	}
	// The cursor is pointing at "else" token
	// Set "else" as marker and consume it
	markerToken = p.tokens[p.cursorPos];
	p.cursorPos++;
	// By this point, "else" is the marker
	parserSkipWhiteSpace(p);
	// If the cursor is out of bound, "{" token is missing
	if (p.cursorPos >= p.tokenLength) {
		const { text, lineNumber, charNumber } =
			markerToken;
		return {
			kind: DiagramNodeKind.ERROR,
			reason: `Incomplete branching block (if-else) declaration. Missing a "{" token.`,
			context: text,
			caretOffset: text.length,
			lineNumber,
			charNumber,
		};
	}
	// The first non-whitespace found is not a "{" token
	// but something else
	if (
		p.tokens[p.cursorPos].kind !==
		DiagramTokenKind.LEFT_CURLY
	) {
		const { text: markerTokenText } = markerToken;
		const {
			text: errorTokenText,
			lineNumber,
			charNumber,
		} = p.tokens[p.cursorPos];
		return {
			kind: DiagramNodeKind.ERROR,
			reason: `Unexpected token found in branching block (if-else) declaration. Expected a "{" token but found "${errorTokenText}" instead.`,
			context: `${markerTokenText} ${errorTokenText}`,
			caretOffset: markerTokenText.length + 1,
			lineNumber,
			charNumber,
		};
	}
	// Set "{" token as marker
	markerToken = p.tokens[p.cursorPos];

	const bodyElseTokens =
		parserCollectTokensBetween(
			p,
			DiagramTokenKind.LEFT_CURLY,
			DiagramTokenKind.RIGHT_CURLY,
		);
	// If body has at least one token,
	// set the last token as marker .
	// If body has no token, keep "{" as marker
	if (bodyElseTokens.length > 0) {
		markerToken =
			bodyElseTokens[bodyElseTokens.length - 1];
	}
	// If the body has no token, the declaration is incomplete
	// Or the body has tokens, but "}" is not found
	if (
		bodyElseTokens.length === 0 ||
		markerToken.kind !==
			DiagramTokenKind.RIGHT_CURLY
	) {
		const { text, lineNumber, charNumber } =
			markerToken;
		return {
			kind: DiagramNodeKind.ERROR,
			reason: `Incomplete branching block (if-else) declaration. Missing a "}" token.`,
			context: text,
			caretOffset: text.length,
			lineNumber,
			charNumber,
		};
	}
	// Consume "}" token from body
	bodyElseTokens.pop();

	node.bodyElse = parserGetAllNodes(
		parserInit(bodyElseTokens),
	);

	return node;
};

const parserGetNextNodeThenAdvance = (
	p: Parser,
): Node => {
	parserSkipWhiteSpace(p);
	if (p.cursorPos >= p.tokenLength) {
		return {
			kind: DiagramNodeKind.EOF,
		};
	}
	const token = p.tokens[p.cursorPos];
	p.cursorPos++;
	if (token.kind === DiagramTokenKind.KEYWORD) {
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

	const tokens: DiagramToken[] = [token];
	let markerToken = token;

	if (
		markerToken.kind ===
		DiagramTokenKind.SEMICOLON
	) {
		return {
			kind: DiagramNodeKind.PROCESS,
			body: [],
		};
	}

	// Consume tokens until ";" or "{" token is found
	while (
		p.cursorPos < p.tokenLength &&
		p.tokens[p.cursorPos].kind !==
			DiagramTokenKind.SEMICOLON &&
		p.tokens[p.cursorPos].kind !==
			DiagramTokenKind.LEFT_CURLY
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
			DiagramTokenKind.LEFT_CURLY &&
			p.tokens[p.cursorPos].kind !==
				DiagramTokenKind.SEMICOLON)
	) {
		const { text, lineNumber, charNumber } =
			markerToken;
		return {
			kind: DiagramNodeKind.ERROR,
			reason: `Incomplete process declaration. Missing a ";" token.`,
			context: text,
			caretOffset: text.length,
			lineNumber,
			charNumber,
		};
	}

	if (
		p.tokens[p.cursorPos].kind ===
		DiagramTokenKind.SEMICOLON
	) {
		p.cursorPos++;
		return {
			kind: DiagramNodeKind.PROCESS,
			body: tokens,
		};
	}

	// It is confirmed that the loop stopped
	// because it encountered a "{" token
	// Set it as marker
	markerToken = p.tokens[p.cursorPos];

	const bodyTokens = parserCollectTokensBetween(
		p,
		DiagramTokenKind.LEFT_CURLY,
		DiagramTokenKind.RIGHT_CURLY,
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
		markerToken.kind !==
			DiagramTokenKind.RIGHT_CURLY
	) {
		const {
			text,
			lineNumber: rowPos,
			charNumber: colPos,
		} = markerToken;
		return {
			kind: DiagramNodeKind.ERROR,
			reason: `Incomplete function declaration. Missing a "}" token.`,
			context: text,
			caretOffset: text.length + 1,
			lineNumber: rowPos,
			charNumber: colPos,
		};
	}
	// Consume the "}" token from body
	bodyTokens.pop();

	return {
		kind: DiagramNodeKind.FUNCTION,
		declaration: tokens,
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
			.kind !== DiagramNodeKind.EOF
	) {
		nodes.push(node);
		if (node.kind === DiagramNodeKind.ERROR) {
			break;
		}
	}

	return nodes;
};
