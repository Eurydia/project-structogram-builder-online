import { Token, TokenKind } from "ast/lexer";

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

const parserBuildLoopFirstNode = (
	p: Parser,
): ASTNodeLoopFirst => {
	const node: ASTNodeLoopFirst = {
		kind: ASTNodeKind.LOOP_FIRST,
		body: [],
		control: [],
	};

	// skip left paren
	p.cursor++;

	let parenPair = -1;
	while (p.cursor < p.tokenLength) {
		switch (p.tokens[p.cursor].kind) {
			case TokenKind.LEFT_PAREN:
				parenPair--;
				break;
			case TokenKind.RIGHT_PAREN:
				parenPair++;
				break;
			default:
				break;
		}

		if (parenPair === 0) {
			break;
		}

		node["control"].push(p.tokens[p.cursor]);
		p.cursor++;
	}

	// skip left curly
	p.cursor++;

	const bodyTokens: Token[] = [];

	let curlyPair = -1;
	while (p.cursor < p.tokenLength) {
		switch (p.tokens[p.cursor].kind) {
			case TokenKind.LEFT_CURLY:
				curlyPair--;
				break;
			case TokenKind.RIGHT_CURLY:
				curlyPair++;
				break;
			default:
				break;
		}

		if (curlyPair === 0) {
			break;
		}

		bodyTokens.push(p.tokens[p.cursor]);
		p.cursor++;
	}

	// skip right curly
	p.cursor++;

	// recursively parse tokens inside loop body
	const innerParser = parserInit(bodyTokens);
	const innerNodes: ASTNode[] = [];

	let innerNode: ASTNode;
	while (
		(innerNode = parserNext(innerParser)).kind !==
		ASTNodeKind.END
	) {
		innerNodes.push(innerNode);
	}

	node["body"] = innerNodes;

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

	const bodyTokens: Token[] = [];

	let curlyPair = -1;
	// skip left curly
	p.cursor++;

	while (p.cursor < p.tokenLength) {
		if (
			p.tokens[p.cursor].kind ===
			TokenKind.LEFT_CURLY
		) {
			curlyPair--;
		}

		if (
			p.tokens[p.cursor].kind ===
			TokenKind.RIGHT_CURLY
		) {
			curlyPair++;
		}

		if (curlyPair === 0) {
			break;
		}

		bodyTokens.push(p.tokens[p.cursor]);
		p.cursor++;
	}

	// skip right curly
	p.cursor++;

	const parser = parserInit(bodyTokens);
	const innerNodes: ASTNode[] = [];
	let innerNode: ASTNode;
	while (
		(innerNode = parserNext(parser)).kind !==
		ASTNodeKind.END
	) {
		innerNodes.push(innerNode);
	}

	node["body"] = innerNodes;

	// skip while keyword
	p.cursor++;

	let parenPair = -1;
	// skip left paren
	p.cursor++;

	while (p.cursor < p.tokenLength) {
		if (
			p.tokens[p.cursor].kind ===
			TokenKind.LEFT_PAREN
		) {
			parenPair--;
		}

		if (
			p.tokens[p.cursor].kind ===
			TokenKind.RIGHT_PAREN
		) {
			parenPair++;
		}

		if (parenPair === 0) {
			break;
		}

		node["control"].push(p.tokens[p.cursor]);
		p.cursor++;
	}

	// skip right paren
	p.cursor++;

	// skip semicolon
	p.cursor++;

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

	let parenPair = -1;
	// skip left paren
	p.cursor++;

	while (p.cursor < p.tokenLength) {
		if (
			p.tokens[p.cursor].kind ===
			TokenKind.LEFT_PAREN
		) {
			parenPair--;
		}

		if (
			p.tokens[p.cursor].kind ===
			TokenKind.RIGHT_PAREN
		) {
			parenPair++;
		}

		if (parenPair === 0) {
			break;
		}

		node["control"].push(p.tokens[p.cursor]);
		p.cursor++;
	}

	// skip right paren
	p.cursor++;

	let bodyTokens: Token[] = [];

	let curlyPair = -1;
	// skip left curly
	p.cursor++;

	while (p.cursor < p.tokenLength) {
		if (
			p.tokens[p.cursor].kind ===
			TokenKind.LEFT_CURLY
		) {
			curlyPair--;
		}

		if (
			p.tokens[p.cursor].kind ===
			TokenKind.RIGHT_CURLY
		) {
			curlyPair++;
		}

		if (curlyPair === 0) {
			break;
		}

		bodyTokens.push(p.tokens[p.cursor]);
		p.cursor++;
	}

	// skip right curly
	p.cursor++;

	let parser = parserInit(bodyTokens);
	let innerNodes: ASTNode[] = [];
	let innerNode: ASTNode;
	while (
		(innerNode = parserNext(parser)).kind !==
		ASTNodeKind.END
	) {
		innerNodes.push(innerNode);
	}

	node["bodyIf"] = innerNodes;

	if (
		p.cursor < p.tokenLength &&
		p.tokens[p.cursor].text !== "else"
	) {
		return node;
	}

	// skip else keyword
	p.cursor++;

	bodyTokens = [];
	curlyPair = -1;
	// skip left curly
	p.cursor++;

	while (p.cursor < p.tokenLength) {
		if (
			p.tokens[p.cursor].kind ===
			TokenKind.LEFT_CURLY
		) {
			curlyPair--;
		}

		if (
			p.tokens[p.cursor].kind ===
			TokenKind.RIGHT_CURLY
		) {
			curlyPair++;
		}

		if (curlyPair === 0) {
			break;
		}

		bodyTokens.push(p.tokens[p.cursor]);
		p.cursor++;
	}

	// skip right curly
	p.cursor++;

	parser = parserInit(bodyTokens);
	innerNodes = [];
	while (
		(innerNode = parserNext(parser)).kind !==
		ASTNodeKind.END
	) {
		innerNodes.push(innerNode);
	}

	node["bodyElse"] = innerNodes;
	return node;
};

export const parserNext = (
	p: Parser,
): ASTNode => {
	if (p.cursor >= p.tokenLength) {
		return {
			kind: ASTNodeKind.END,
		};
	}

	const token = p.tokens[p.cursor];
	p.cursor++;

	if (token.kind === TokenKind.KEYWORD) {
		if (
			token.text === "for" ||
			token.text === "while"
		) {
			return parserBuildLoopFirstNode(p);
		}

		if (token.text === "do") {
			return parserBuildLoopLastNode(p);
		}

		if (token.text === "if") {
			return parseBuildIfElseNode(p);
		}
	}

	const node: ASTNodeProcess = {
		kind: ASTNodeKind.PROCESS,
		body: [token],
	};
	while (
		p.cursor < p.tokenLength &&
		p.tokens[p.cursor].kind !==
			TokenKind.SEMICOLON
	) {
		node["body"].push(p.tokens[p.cursor]);
		p.cursor++;
	}
	// skip semicolon
	p.cursor++;
	return node;
};
