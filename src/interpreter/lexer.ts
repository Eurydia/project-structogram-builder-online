export enum TokenKind {
	END = 0,
	SYMBOL,
	KEYWORD,

	LEFT_PAREN,
	RIGHT_PAREN,
	LEFT_CURLY,
	RIGHT_CURLY,
	SEMICOLON,
	WHITE_SPACE,
}

export type Token = {
	kind: TokenKind;
	text: string;
};

const KEYWORDS: string[] = [
	"for",
	"if",
	"else",
	"while",
	"do",
	"func",
	"proc",
];

const LITERAL_TOKENS: Record<string, TokenKind> =
	{
		"{": TokenKind.LEFT_CURLY,
		"}": TokenKind.RIGHT_CURLY,
		"(": TokenKind.LEFT_PAREN,
		")": TokenKind.RIGHT_PAREN,
		";": TokenKind.SEMICOLON,
	};

export type Lexer = {
	content: string;
	contentLength: number;
	cursorPos: number;
};

export const lexerInit = (
	content: string,
): Lexer => {
	return {
		content: content.normalize(),
		contentLength: content.normalize().length,
		cursorPos: 0,
	};
};

export const lexerGetNextTokenThenAdvance = (
	l: Lexer,
): Token => {
	const token = {
		kind: TokenKind.END,
		text: "",
	};

	if (l.cursorPos >= l.contentLength) {
		return token;
	}

	if (/\s/.test(l.content[l.cursorPos])) {
		token["kind"] = TokenKind.WHITE_SPACE;
		token["text"] = l.content[l.cursorPos];
		l.cursorPos++;
		return token;
	}

	token["text"] = l.content[l.cursorPos];
	l.cursorPos++;

	if (token["text"] in LITERAL_TOKENS) {
		token["kind"] = LITERAL_TOKENS[token["text"]];
		return token;
	}

	while (
		l.cursorPos < l.contentLength &&
		!(l.content[l.cursorPos] in LITERAL_TOKENS) &&
		!/\s/.test(l.content[l.cursorPos])
	) {
		token["text"] += l.content[l.cursorPos];
		l.cursorPos++;
	}

	if (KEYWORDS.includes(token["text"])) {
		token["kind"] = TokenKind.KEYWORD;
		return token;
	}

	token["kind"] = TokenKind.SYMBOL;
	return token;
};

export const lexerGetAllTokens = (
	l: Lexer,
): Token[] => {
	const tokens: Token[] = [];
	let token: Token;
	while (
		(token = lexerGetNextTokenThenAdvance(l))
			.kind !== TokenKind.END
	) {
		tokens.push(token);
	}
	return tokens;
};
