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
];

const LITERAL_TOKENS: Record<string, TokenKind> =
	{
		"{": TokenKind.LEFT_CURLY,
		"}": TokenKind.RIGHT_CURLY,
		"(": TokenKind.LEFT_PAREN,
		")": TokenKind.RIGHT_PAREN,
		";": TokenKind.SEMICOLON,
		" ": TokenKind.WHITE_SPACE,
	};

export type Lexer = {
	content: string;
	contentLength: number;
	cursorPos: number;
};

const cleanContent = (
	content: string,
): string => {
	let cleanedContent = "";

	const length = content.length;
	let i = 0;
	while (i < length) {
		cleanedContent += content[i];
		i++;

		if (cleanedContent.endsWith("//")) {
			cleanedContent = cleanedContent.slice(
				0,
				-2,
			);

			while (i < length && content[i] !== "\n") {
				i++;
			}
		}
	}

	return cleanedContent;
};

export const lexerInit = (
	content: string,
): Lexer => {
	const cleanedContent = cleanContent(
		content.normalize().replace(/\s+/g, " "),
	);

	return {
		content: cleanedContent,
		contentLength: cleanedContent.length,
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

	token.text = l.content[l.cursorPos];
	l.cursorPos++;

	if (token.text in LITERAL_TOKENS) {
		token.kind = LITERAL_TOKENS[token.text];
		return token;
	}

	while (
		l.cursorPos < l.contentLength &&
		!(l.content[l.cursorPos] in LITERAL_TOKENS) &&
		l.content[l.cursorPos] !== " "
	) {
		token.text += l.content[l.cursorPos];
		l.cursorPos++;
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
