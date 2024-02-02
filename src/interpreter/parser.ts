import {
	DiagramToken,
	DiagramTokenKind,
} from "./lexer";
/**
 * This module provides implementation for parsers which are needed to convert a list of tokens into an abstract syntax tree.
 */
// ---------------------------------------------

/**
 * The `DiagramNodeKind` enumeration represents different kinds of nodes that can appear in the abstract syntax tree.
 * Each "DiagramNode" object is assigned a "DiagramNodeKind" member as its "kind" property.
 */
export enum DiagramNodeKind {
	/**
	 * This member represents the end of the abstract syntax tree.
	 * It signals the end of parsing process.
	 */
	END = 0,

	/**
	 * This member represents a parsing error.
	 * It signals syntax errors and the end of parsing process.
	 */
	ERROR,

	/**
	 * This member represents a process node.
	 * It is the catch-all category for any sequence of tokens that do not fit into any other category.
	 */
	PROCESS,

	/**
	 * This member represents a test-first loop node for "for" and "while" loops.
	 */
	LOOP_FIRST,

	/**
	 * This member represents a test-last loop node for "do-while" loops.
	 */
	LOOP_LAST,

	/**
	 * This member represents an if-else branching node for "if" and "if-else" blocks.
	 */
	IF_ELSE,

	/**
	 * This member represents a function node.
	 */
	FUNCTION,
}

/**
 * The "DiagramNodeEnd" object represents the end of the parsing process.
 */
type DiagramNodeEnd = {
	kind: DiagramNodeKind.END;
};

/**
 * The "DiagramNodeError" object represents a parsing error.
 */
type DiagramNodeError = {
	kind: DiagramNodeKind.ERROR;
	/**
	 * The line number where the error occurred.
	 * It is 1-indexed, and starts counting from the position of the first character in the string.
	 */
	lineNumber: number;

	/**
	 * The character number where the error occurred.
	 * It is 1-indexed, and starts counting from the position of the first character in the string.
	 */
	charNumber: number;

	/**
	 * The point in which an error occurred and its surrounding context.
	 */
	context: string;

	/**
	 * The number of characters to offset the caret from the start of the context string.
	 * It helps to visually indicate the location of the error within the "context" string.
	 */
	caretOffset: number;

	/**
	 * The reason and explanation for the error.
	 */
	reason: string;
};

/**
 * The "DiagramNodeProcess" object represents a process block.
 */
type DiagramNodeProcess = {
	kind: DiagramNodeKind.PROCESS;

	/**
	 * The sequence of "DiagramToken" objects that make up the body of the process.
	 */
	body: DiagramToken[];
};

/**
 * The "DiagramNodeLoopFirst" object represents a test-first loop.
 */
type DiagramNodeLoopFirst = {
	kind: DiagramNodeKind.LOOP_FIRST;

	/**
	 * The sequence of `DiagramToken` objects that make up the condition.
	 */
	condition: DiagramToken[];

	/**
	 * The sequence of "DiagramNode" objects that make up the body of the loop.
	 * They are collected as "DiagramToken" objects and recursively parsed into "DiagramNode" objects.
	 */
	body: DiagramNode[];
};

/**
 * The "DiagramNodeLoopLast" object represents a test-last loop.
 */
type DiagramNodeLoopLast = {
	kind: DiagramNodeKind.LOOP_LAST;

	/**
	 * The sequence of `DiagramToken` objects that make up the condition.
	 */
	condition: DiagramToken[];

	/**
	 * The sequence of "DiagramNode" objects that make up the body of the loop.
	 * They are collected as "DiagramToken" objects and recursively parsed into "DiagramNode" objects.
	 */
	body: DiagramNode[];
};

/**
 * The "DiagramNodeIfElse" object represents a branching block.
 */
type DiagramNodeIfElse = {
	kind: DiagramNodeKind.IF_ELSE;

	/**
	 * The sequence of "DiagramToken" objects that make up the condition.
	 */
	condition: DiagramToken[];

	/**
	 * The sequence of "DiagramNode" objects that make up the body of the if branch.
	 * They are collected as "DiagramToken" objects and recursively parsed into "DiagramNode" objects.
	 */
	bodyIf: DiagramNode[];

	/**
	 * Same as "bodyIf" but for the else branch.
	 */
	bodyElse: DiagramNode[];
};

/**
 * The "DiagramNodeFunction" object represents a function.
 */
type DiagramNodeFunction = {
	kind: DiagramNodeKind.FUNCTION;

	/**
	 * The sequence of "DiagramToken" objects that make up the function declaration.
	 */
	declaration: DiagramToken[];

	/**
	 * The sequence of "DiagramNode" objects that make up the body of the function.
	 * They are collected as "DiagramToken" objects and recursively parsed into "DiagramNode" objects.
	 */
	body: DiagramNode[];
};

/**
 * The "DiagramNode" union type represents different kinds of nodes that can appear in the abstract syntax tree.
 */
export type DiagramNode =
	| DiagramNodeEnd
	| DiagramNodeProcess
	| DiagramNodeLoopFirst
	| DiagramNodeLoopLast
	| DiagramNodeIfElse
	| DiagramNodeFunction
	| DiagramNodeError;

/**
 * The "Parser" object represents a parser.
 * It is used to convert a list of tokens into an abstract syntax tr
 */
export type Parser = {
	/**
	 * The list of tokens to be parsed.
	 */
	tokens: DiagramToken[];

	/**
	 * The number of tokens in the list.
	 */
	tokenLength: number;

	/**
	 * The position of the cursor in the list.
	 */
	cursorPos: number;
};

/**
 * The "parserInit" function initializes a "Parser" object with the given sequence of "DiagramToken" objects.
 */
export const parserInit = (
	tokens: DiagramToken[],
): Parser => {
	return {
		tokens: tokens,
		tokenLength: tokens.length,
		cursorPos: 0,
	};
};

/**
 * The "parserCollectTokensBetween" function collects tokens between two given tokens.
 * The primary use case is to collect tokens between a pair od parentheses or curly braces.
 */
const parserCollectTokensBetween = (
	p: Parser,
	startToken: DiagramTokenKind,
	stopToken: DiagramTokenKind,
): DiagramToken[] => {
	// If the cursor is out of bound, return an empty array
	if (p.cursorPos >= p.tokenLength) {
		return [];
	}
	// If the current token is not the start token, return an empty array
	if (p.tokens[p.cursorPos].kind !== startToken) {
		return [];
	}
	// Consume the start token
	p.cursorPos++;
	// Does not include the start but includes the stop token
	const tokens: DiagramToken[] = [];

	// The "depth" variable is useful for keeping track of the "level" of the tokens
	let depth = -1;

	// The idea is to consume tokens until the depth is zero
	// To clarify, the last "stopToken" is included, but the first "startToken" is not.
	let token: DiagramToken;
	while (p.cursorPos < p.tokenLength) {
		// Consume the token from the parser and collect it to the result
		token = p.tokens[p.cursorPos];
		p.cursorPos++;
		tokens.push(token);
		if (token.kind === startToken) {
			depth--;
		}
		if (token.kind === stopToken) {
			depth++;
		}
		// The start and stop tokens are balanced
		// No need to continue
		if (depth === 0) {
			break;
		}
	}
	// The cursor is pointing at the token immediately after the stop token
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

const buildMissingTokenError = (
	markerToken: DiagramToken,
	at: string,
	missingToken: string,
): DiagramNodeError => {
	const { text, lineNumber, charNumber } =
		markerToken;
	const reason = `Incomplete ${at} declaration. Missing a "${missingToken}" token.`;
	return {
		kind: DiagramNodeKind.ERROR,
		reason,
		context: text,
		caretOffset: text.length,
		lineNumber,
		charNumber,
	};
};

const buildUnexpectedTokenError = (
	markerToken: DiagramToken,
	errorToken: DiagramToken,
	at: string,
	expectedToken: string,
): DiagramNodeError => {
	const { text: markerTokenText } = markerToken;
	const {
		text: errorTokenText,
		lineNumber,
		charNumber,
	} = errorToken;
	const reason = `Unexpected token found in ${at} declaration. Expected a "${expectedToken}" token but found "${errorTokenText}" instead.`;
	return {
		kind: DiagramNodeKind.ERROR,
		reason,
		context: `${markerTokenText} ${errorTokenText}`,
		caretOffset: markerTokenText.length + 1,
		lineNumber,
		charNumber,
	};
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
		return buildMissingTokenError(
			markerToken,
			"test-first loop",
			"(",
		);
	}
	// The first non-whitespace found is not a "(" token
	// but something else
	if (
		p.tokens[p.cursorPos].kind !==
		DiagramTokenKind.LEFT_PAREN
	) {
		return buildUnexpectedTokenError(
			markerToken,
			p.tokens[p.cursorPos],
			"test-first loop",
			"(",
		);
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
		return buildMissingTokenError(
			markerToken,
			"test-first loop",
			")",
		);
	}
	// Consume ")" token from condition
	node.condition.pop();
	// By this point, ")" token is the marker
	parserSkipWhiteSpace(p);
	// If the cursor is out of bound, "{" token is missing
	if (p.cursorPos >= p.tokenLength) {
		return buildMissingTokenError(
			markerToken,
			"test-first loop",
			"{",
		);
	}
	// The first non-whitespace found is not a "{" token
	// but something else
	if (
		p.tokens[p.cursorPos].kind !==
		DiagramTokenKind.LEFT_CURLY
	) {
		return buildUnexpectedTokenError(
			markerToken,
			p.tokens[p.cursorPos],
			"test-first loop",
			"{",
		);
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
		return buildMissingTokenError(
			markerToken,
			"test-first loop",
			"}",
		);
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
		return buildMissingTokenError(
			markerToken,
			"test-last loop",
			"{",
		);
	}
	// The first non-whitespace found is not a "{" token
	// but something else
	if (
		p.tokens[p.cursorPos].kind !==
		DiagramTokenKind.LEFT_CURLY
	) {
		return buildUnexpectedTokenError(
			markerToken,
			p.tokens[p.cursorPos],
			"test-last loop",
			"{",
		);
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
		return buildMissingTokenError(
			markerToken,
			"test-last loop",
			"}",
		);
	}
	// Consume the "}" token in body
	bodyTokens.pop();
	// By this point, the marker is "}" token
	parserSkipWhiteSpace(p);
	// If the cursor is out of bound, "while" token is missing
	if (p.cursorPos >= p.tokenLength) {
		return buildMissingTokenError(
			markerToken,
			"test-last loop",
			"while",
		);
	}
	// The first non-whitespace found after "}" is not a "while" token
	// but something else
	if (
		p.tokens[p.cursorPos].kind !==
			DiagramTokenKind.KEYWORD ||
		p.tokens[p.cursorPos].text !== "while"
	) {
		return buildUnexpectedTokenError(
			markerToken,
			p.tokens[p.cursorPos],
			"test-last loop",
			"while",
		);
	}
	// Set "while" token as marker
	markerToken = p.tokens[p.cursorPos];
	// Consume "while token"
	p.cursorPos++;
	parserSkipWhiteSpace(p);
	// If the cursor is out of bound, "(" token is missing
	if (p.cursorPos >= p.tokenLength) {
		return buildMissingTokenError(
			markerToken,
			"test-last loop",
			"(",
		);
	}
	// The first non-whitespace found is not a "(" token
	// but something else
	if (
		p.tokens[p.cursorPos].kind !==
		DiagramTokenKind.LEFT_PAREN
	) {
		return buildUnexpectedTokenError(
			markerToken,
			p.tokens[p.cursorPos],
			"test-last loop",
			"(",
		);
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
		return buildMissingTokenError(
			markerToken,
			"test-last loop",
			")",
		);
	}
	// Consume ")" token from condition
	node.condition.pop();
	// At this point, ")" is the marker
	parserSkipWhiteSpace(p);
	// If the cursor is out of bound, ";" token is missing
	if (p.cursorPos >= p.tokenLength) {
		return buildMissingTokenError(
			markerToken,
			"test-last loop",
			";",
		);
	}
	// The first non-whitespace found after ")" is not a ";" token
	// but something else
	if (
		p.tokens[p.cursorPos].kind !==
		DiagramTokenKind.SEMICOLON
	) {
		return buildUnexpectedTokenError(
			markerToken,
			p.tokens[p.cursorPos],
			"test-last loop",
			";",
		);
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
		return buildMissingTokenError(
			markerToken,
			"branching block (if)",
			"(",
		);
	}
	// The first non-whitespace found is not a "(" token
	// but something else
	if (
		p.tokens[p.cursorPos].kind !==
		DiagramTokenKind.LEFT_PAREN
	) {
		return buildUnexpectedTokenError(
			markerToken,
			p.tokens[p.cursorPos],
			"branching block (if)",
			"(",
		);
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
		return buildMissingTokenError(
			markerToken,
			"branching block (if)",
			")",
		);
	}
	// Consume ")" token from condition
	node.condition.pop();
	// By this point, ")" token is the marker
	parserSkipWhiteSpace(p);
	// If the cursor is out of bound, "{" token is missing
	if (p.cursorPos >= p.tokenLength) {
		return buildMissingTokenError(
			markerToken,
			"branching block (if)",
			"{",
		);
	}
	// The first non-whitespace found is not a "{" token
	// but something else
	if (
		p.tokens[p.cursorPos].kind !==
		DiagramTokenKind.LEFT_CURLY
	) {
		return buildUnexpectedTokenError(
			markerToken,
			p.tokens[p.cursorPos],
			"branching block (if)",
			"{",
		);
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
		return buildMissingTokenError(
			markerToken,
			"branching block (if)",
			"}",
		);
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
		return buildMissingTokenError(
			markerToken,
			"branching block (if-else)",
			"{",
		);
	}
	// The first non-whitespace found is not a "{" token
	// but something else
	if (
		p.tokens[p.cursorPos].kind !==
		DiagramTokenKind.LEFT_CURLY
	) {
		return buildUnexpectedTokenError(
			markerToken,
			p.tokens[p.cursorPos],
			"branching block (if-else)",
			"{",
		);
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
		return buildMissingTokenError(
			markerToken,
			"branching block (if-else)",
			"}",
		);
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
): DiagramNode => {
	parserSkipWhiteSpace(p);
	if (p.cursorPos >= p.tokenLength) {
		return {
			kind: DiagramNodeKind.END,
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
		return buildMissingTokenError(
			markerToken,
			"process",
			";",
		);
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
		return buildMissingTokenError(
			markerToken,
			"function",
			"}",
		);
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
): DiagramNode[] => {
	const nodes: DiagramNode[] = [];
	let node: DiagramNode;
	while (
		(node = parserGetNextNodeThenAdvance(p))
			.kind !== DiagramNodeKind.END
	) {
		nodes.push(node);
		if (node.kind === DiagramNodeKind.ERROR) {
			break;
		}
	}

	return nodes;
};
