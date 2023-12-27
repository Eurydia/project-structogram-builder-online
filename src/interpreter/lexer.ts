export enum TokenKind {
	END = 0,
	SYMBOL,
	LITERAL_STRING,
	KEYWORD,

	LEFT_PAREN,
	RIGHT_PAREN,
	LEFT_CURLY,
	RIGHT_CURLY,
	SEMICOLON,
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
	cursor: number;
};

export const lexerInit = (
	content: string,
): Lexer => {
	return {
		content: content.normalize(),
		contentLength: content.length,
		cursor: 0,
	};
};

const lexerSafeGetNextCharThenAdvance = (
	l: Lexer,
): string => {
	if (l.cursor >= l.contentLength) {
		return "";
	}

	const char = l.content[l.cursor];
	l.cursor++;
	return char;
};

const lexerTrimLeft = (l: Lexer): void => {
	while (
		l.cursor < l.contentLength &&
		/\s/.test(l.content[l.cursor])
	) {
		l.cursor++;
	}
};

export const lexerSafeGetNextTokenThenAdvance = (
	l: Lexer,
): Token => {
	lexerTrimLeft(l);

	const token = {
		kind: TokenKind.END,
		text: "",
	};

	if (l.cursor >= l.contentLength) {
		return token;
	}

	token["text"] =
		lexerSafeGetNextCharThenAdvance(l);

	if (token["text"] in LITERAL_TOKENS) {
		token["kind"] = LITERAL_TOKENS[token["text"]];
		return token;
	}

	while (
		l.cursor < l.contentLength &&
		!(l.content[l.cursor] in LITERAL_TOKENS) &&
		!/\s/.test(l.content[l.cursor])
	) {
		token["text"] += l.content[l.cursor];
		l.cursor++;
	}

	if (KEYWORDS.includes(token.text)) {
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
		(token = lexerSafeGetNextTokenThenAdvance(l))
			.kind !== TokenKind.END
	) {
		tokens.push(token);
	}
	return tokens;
};
