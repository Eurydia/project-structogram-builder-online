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
 * The "DiagramNodeENd" object represents the end of the parsing process.
 */
type DiagramNodeEnd = {
	kind: DiagramNodeKind.END;
};

/**
 * The "DiagramNodeError" object represents a parsing error, along with the context and reason for the error.
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
 * The "DiagramNodeProcess" object represents a process node.
 */
type DiagramNodeProcess = {
	kind: DiagramNodeKind.PROCESS;

	/**
	 * The body of the process.
	 * These tokens are joined together to form a string that represents the process.
	 */
	body: DiagramToken[];
};

/**
 * The "DiagramNodeLoopFirst" object represents a test-first loop node.
 */
type DiagramNodeLoopFirst = {
	kind: DiagramNodeKind.LOOP_FIRST;

	/**
	 * The condition for the loop.
	 * These tokens are joined together to form a string that represents the condition.
	 */
	condition: DiagramToken[];

	/**
	 * The body of the loop.
	 * These nodes are recursively rendered to form the body of the loop.
	 */
	body: DiagramNode[];
};

/**
 * The "DiagramNodeLoopLast" object represents a test-last loop node.
 */
type DiagramNodeLoopLast = {
	kind: DiagramNodeKind.LOOP_LAST;

	/**
	 * The condition for the loop.
	 * These tokens are joined together to form a string that represents the condition.
	 */
	condition: DiagramToken[];

	/**
	 * The body of the loop.
	 * These nodes are recursively rendered to form the body of the loop.
	 */
	body: DiagramNode[];
};

/**
 * The "DiagramNodeIfElse" object represents an if-else branching node.
 */
type DiagramNodeIfElse = {
	kind: DiagramNodeKind.IF_ELSE;

	/**
	 * The condition for the branching block.
	 * These tokens are joined together to form a string that represents the condition.
	 */
	condition: DiagramToken[];

	/**
	 * The body of the if branch.
	 * These nodes are recursively rendered to form the body of the if branch.
	 */
	bodyIf: DiagramNode[];

	/**
	 * The body of the else branch.
	 * These nodes are recursively rendered to form the body of the else branch.
	 */
	bodyElse: DiagramNode[];
};

/**
 * The "DiagramNodeFunction" object represents a function node.
 */
type DiagramNodeFunction = {
	kind: DiagramNodeKind.FUNCTION;

	/**
	 * The declaration of the function.
	 * These tokens are joined together to form a string that represents the declaration.
	 */
	declaration: DiagramToken[];

	/**
	 * The body of the function.
	 * These nodes are recursively rendered to form the body of the function.
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
