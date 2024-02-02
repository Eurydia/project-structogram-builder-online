/**
 * @exports
 * @readonly
 * @enum {number}
 * @description
 * This enum categorizes the different types of tokens that the lexer recognizes.
 * Each `Token` object is assigned a `TokenKind` member.
 * @see Token
 */
export enum DiagramTokenKind {
	/**
	 * @description
	 *
	 * This member represents the end of input.
	 * It marks the end of tokenization process.
	 */
	EOF = 0,

	/**
	 * @description
	 *
	 * This member represents a word, more specifically, any sequence of non-whitespace characters.
	 * Essentially, any contiguous sequence of characters excluding whitespace is categorized by this member.
	 */
	SYMBOL,

	/**
	 * @description
	 *
	 * This member represents reserved keywords.
	 * It is a subset of "SYMBOL" member and is used to categorize reserved keywords in the language.
	 * Simply put, every keyword starts off as a "SYMBOL" member and is then categorized as a "KEYWORD" member.
	 */
	KEYWORD,

	/**
	 * @description
	 *
	 * This member represents a left parenthesis "(."
	 */
	LEFT_PAREN,

	/**
	 * @description
	 *
	 * This member represents a right parenthesis ")" literal.
	 */
	RIGHT_PAREN,

	/**
	 * @description
	 *
	 * This member represents a left curly brace "{" literal.
	 * */
	LEFT_CURLY,

	/**
	 * @description
	 *
	 * This member represents a right curly brace "}" literal.
	 * */
	RIGHT_CURLY,

	/**
	 * @description
	 *
	 * This member represents a semicolon ";" literal.
	 * */
	SEMICOLON,

	/**
	 * @description
	 *
	 * This member represents any whitespace characters.
	 * More specfically, it matches characters defined by "\s" character class.
	 *
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions/Character_classes}
	 */
	WHITE_SPACE,
}

export type DiagramToken = {
	kind: DiagramTokenKind;
	text: string;
	lineNumber: number;
	charNumber: number;
};

const KEYWORDS: string[] = [
	"for",
	"if",
	"else",
	"while",
	"do",
];

const LITERAL_TOKENS: Record<
	string,
	DiagramTokenKind
> = {
	"{": DiagramTokenKind.LEFT_CURLY,
	"}": DiagramTokenKind.RIGHT_CURLY,
	"(": DiagramTokenKind.LEFT_PAREN,
	")": DiagramTokenKind.RIGHT_PAREN,
	";": DiagramTokenKind.SEMICOLON,
};

export type Lexer = {
	content: string;
	contentLength: number;
	cursorPos: number;

	lineNumber: number;
	charNumber: number;
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
		charNumber: 1,
		lineNumber: 1,
	};
};

export const lexerGetNextTokenThenAdvance = (
	l: Lexer,
): DiagramToken => {
	const token: DiagramToken = {
		kind: DiagramTokenKind.EOF,
		text: "",
		lineNumber: l.lineNumber,
		charNumber: l.charNumber,
	};

	if (l.cursorPos >= l.contentLength) {
		return token;
	}

	token.text = l.content[l.cursorPos];
	l.cursorPos++;
	l.charNumber++;

	if (/\s/.test(token.text)) {
		token.kind = DiagramTokenKind.WHITE_SPACE;
		if (token.text === "\n") {
			l.lineNumber++;
			l.charNumber = 1;
		}
		return token;
	}

	if (token.text in LITERAL_TOKENS) {
		token.kind = LITERAL_TOKENS[token.text];
		return token;
	}

	while (
		l.cursorPos < l.contentLength &&
		!(l.content[l.cursorPos] in LITERAL_TOKENS) &&
		!/\s/.test(l.content[l.cursorPos])
	) {
		token.text += l.content[l.cursorPos];
		l.cursorPos++;
		l.charNumber++;
	}

	if (KEYWORDS.includes(token.text)) {
		token.kind = DiagramTokenKind.KEYWORD;
		return token;
	}

	token.kind = DiagramTokenKind.SYMBOL;
	return token;
};

export const lexerGetAllTokens = (
	l: Lexer,
): DiagramToken[] => {
	const tokens: DiagramToken[] = [];
	let token: DiagramToken;
	while (
		(token = lexerGetNextTokenThenAdvance(l))
			.kind !== DiagramTokenKind.EOF
	) {
		tokens.push(token);
	}
	return tokens;
};
