/**
 * This enum categorizes the different types of tokens that the lexer recognizes.
 * Each "DiagramToken" object is assigned a "TokenKind" member as its "kind" property.
 */
export enum DiagramTokenKind {
	/**
	 * This member represents the end of input.
	 * It marks the end of tokenization process.
	 */
	EOF = 0,

	/**
	 * This member represents a word, more specifically, any sequence of non-whitespace characters.
	 * Essentially, any contiguous sequence of characters excluding whitespace is categorized by this member.
	 */
	SYMBOL,

	/**
	 * This member represents reserved keywords.
	 * It is a subset of "SYMBOL" member and is used to categorize reserved keywords in the language.
	 * During tokenization, keywords start off as a "SYMBOL" member and is then categorized as a "KEYWORD" member.
	 */
	KEYWORD,

	/**
	 * This member represents a left parenthesis "(."
	 */
	LEFT_PAREN,

	/**
	 * This member represents a right parenthesis ")" literal.
	 */
	RIGHT_PAREN,

	/**
	 * This member represents a left curly brace "{" literal.
	 * */
	LEFT_CURLY,

	/**
	 * This member represents a right curly brace "}" literal.
	 * */
	RIGHT_CURLY,

	/**
	 * This member represents a semicolon ";" literal.
	 * */
	SEMICOLON,

	/**
	 * This member represents any whitespace characters.
	 * More specfically, it matches characters defined by "\s" [character class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions/Character_classes).
	 */
	WHITE_SPACE,
}

/**
 * A "Token" object represents a tokenized input.
 * It encapsulates a meaningful sequence of characters and provides addition context and information about the token's.
 */
export type DiagramToken = {
	/**
	 * The kind of token.
	 * */
	kind: DiagramTokenKind;
	/**
	 * The string associated with the token.
	 */
	text: string;
	/**
	 * The line number where the token is located.
	 * It is 1-indexed and starts counting from the position of the first character in the string.
	 */
	lineNumber: number;
	/**
	 * The character number where the token is located.
	 * It is 1-indexed, and starts counting from the position of the first character in the string
	 */
	charNumber: number;
};

/**
 * The "KEYWORDS" array defines a list of keywords for the lexer.
 * The intention is to provide a centralized list of keywords that the lexer can use to categorize tokens.
 *
 * During tokenization process, the lexer checks if each word is in this array.
 * If it is, it replaces the "kind" property of that "DiagramToken" object with "DiagramTokenKind.KEYWORD" member.
 */
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
