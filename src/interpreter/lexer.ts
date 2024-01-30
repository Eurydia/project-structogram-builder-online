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
	rowPos: number;
	colPos: number;
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
	cursorPos: number;

	cursorRow: number;
	cursorCol: number;
};

const removeComments = (
	content: string,
): string => {
	let cleanContent = "";

	let contentPos = 0;
	while (contentPos < content.length) {
		if (
			contentPos + 1 < content.length &&
			content[contentPos] === "/" &&
			content[contentPos + 1] === "/"
		) {
			while (
				contentPos < content.length &&
				content[contentPos] !== "\n"
			) {
				contentPos++;
			}
		}
		cleanContent += content[contentPos];
		contentPos++;
	}

	return cleanContent;
};

export const lexerInit = (
	content: string,
): Lexer => {
	const cleanedContent = removeComments(
		content.normalize(),
	);

	return {
		content: cleanedContent,
		contentLength: cleanedContent.length,
		cursorPos: 0,
		cursorCol: 1,
		cursorRow: 1,
	};
};

export const lexerGetNextTokenThenAdvance = (
	l: Lexer,
): Token => {
	const token: Token = {
		kind: TokenKind.END,
		text: "",
		rowPos: l.cursorRow,
		colPos: l.cursorCol,
	};

	if (l.cursorPos >= l.contentLength) {
		return token;
	}

	token["text"] = l.content[l.cursorPos];
	l.cursorPos++;

	if (/\s/.test(token.text)) {
		token.kind = TokenKind.WHITE_SPACE;
		if (token.text === "\n") {
			l.cursorRow++;
			l.cursorCol = 1;
		}
		return token;
	}

	if (token["text"] in LITERAL_TOKENS) {
		token["kind"] = LITERAL_TOKENS[token["text"]];
		return token;
	}

	while (
		l["cursorPos"] < l.contentLength &&
		!(l.content[l.cursorPos] in LITERAL_TOKENS) &&
		!/\s/.test(l.content[l.cursorPos])
	) {
		token["text"] += l.content[l.cursorPos];
		l.cursorPos++;
		l.cursorCol++;
	}

	if (KEYWORDS.includes(token.text)) {
		token.kind = TokenKind.KEYWORD;
		return token;
	}

	token.kind = TokenKind.SYMBOL;
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
