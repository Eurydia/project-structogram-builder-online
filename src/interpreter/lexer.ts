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
 * If it is, it updates the "kind" property of that "DiagramToken" object with "DiagramTokenKind.KEYWORD" member.
 */
const KEYWORDS: string[] = [
	"for",
	"if",
	"else",
	"while",
	"do",
];

/**
 * The "LITERAL_TOKENS" record defines a mapping of literal characters to their corresponding token kinds.
 * The intention is similar to "KEYWORDS" array, but for literal characters.
 *
 * During tokenization, the lexer checks if each character is a key of this record.
 * If it is, it updates the "kind" property of that "DiagramToken" object with corresponding value of that key.
 */
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
/**
 * The "Lexer" object represents a lexer.
- 
 */
export type Lexer = {
	/**
	 * The input string to be tokenized.
	 */
	content: string;
	/**
	 * The length of the input string.
	 */
	contentLength: number;
	/**
	 * The current position of the cursor in the input string.
	 */
	cursorPos: number;
	/**
	 * The current line number.
	 * It is 1-indexed and increments when the lexer encounters a newline character.
	 */
	lineNumber: number;
	/**
	 * The current character number.
	 * It is 1-indexed, increments when the lexer encounters a character and resets to one when moving to the next line.
	 */
	charNumber: number;
};

/**
 * The "removeComments" function takes in an input string and removes all comments from it, and returns a string with all comments removed.
 *
 * This function is a preprocessing step before tokenization, and it is called by the "lexerInit" function.
 */
const removeComments = (
	content: string,
): string => {
	// The "cleanContent" variable stores the input string with all comments removed.
	let cleanContent = "";

	// The idea is to iterate through each character in the input string.
	// If a specific sequence of characters is encountered, the function skips all characters until the end of the line.
	// To clarify to "skip" is simply to not include the characters in the "cleanContent" variable.
	let contentPos = 0;
	while (contentPos < content.length) {
		// If both the current character abd the next character are forward slashes, skip all characters until the end of the line.
		if (
			contentPos + 1 < content.length &&
			content[contentPos] === "/" &&
			content[contentPos + 1] === "/"
		) {
			// It is important to note that the newline character is included in the "cleanContent" variable.
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
