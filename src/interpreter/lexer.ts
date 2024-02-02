/**
 * This module provides implementation for a lexer.
 * The language I have created is simple and the lexer is designed to be simple as well.
 */
// ---------------------------------------------
/**
 * The "DiagramTokenKind" enum categorizes the different types of tokens that the lexer recognizes.
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
	 * This member represents any whitespace characters.
	 * More specfically, it matches characters defined by "\s" [character class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions/Character_classes).
	 */
	WHITE_SPACE,

	/**
	 * This member represents a left parenthesis "(" literal.
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
 * The "KEYWORDS" array defines a list of reserved keywords for the lexer.
 * The intention is to define a centralized collection of keywords.
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
 * The "LITERAL_TOKENS" record defines a mapping of literal characters to the appropriate "DiagramTokenKind" members.
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
	 * It is 1-indexed and increments when the lexer encounters any character.
	 * It resets to one when moving to the next line.
	 */
	charNumber: number;
};

/**
 * The "removeComments" function takes in an input string, removes comments from it, and returns a string the comments removed.
 *
 * This function is a preprocessor, and it is called by the "lexerInit" function.
 */
const removeComments = (
	content: string,
): string => {
	let preprocessedContent = "";

	// The idea is to iterate through each character in the input string.
	// If a specific sequence of characters is encountered, the function skips all characters until the end of the line.
	// To clarify to "skip" is simply to not include the characters in the "cleanContent" variable.
	let contentPos = 0;
	while (contentPos < content.length) {
		// If both the current character abd the next character are forward slashes, skip all characters.
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
		preprocessedContent += content[contentPos];
		contentPos++;
	}
	return preprocessedContent;
};

/**
 * The "lexerInit" function initializes a "Lexer" object from the given input string.
 */
export const lexerInit = (
	content: string,
): Lexer => {
	// Calling "String.normalize()"on input string is important due to the way accented characters behave.
	// See discussion on accented characters https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
	const preprocessedContent = removeComments(
		content.normalize(),
	);
	return {
		content: preprocessedContent,
		contentLength: preprocessedContent.length,
		cursorPos: 0,
		lineNumber: 1,
		charNumber: 1,
	};
};

/**
 * The "lexerGetNextToken" function tokenizes a token, returns it, and advances the cursor position.
 *
 * This function is resposible for the actual tokenization process.
 */
const lexerGetNextToken = (
	l: Lexer,
): DiagramToken => {
	// The "token" variable stores the tokenized input.
	// The properties of this token are updated and corrected as the function tokenizes the input string.
	const token: DiagramToken = {
		kind: DiagramTokenKind.EOF,
		text: "",
		lineNumber: l.lineNumber,
		charNumber: l.charNumber,
	};

	// If there is no character left in the input string, return the "token" object.
	if (l.cursorPos >= l.contentLength) {
		return token;
	}

	// There is at least one character left, consume it, and advance the "charNumber" and "cursorPos".
	token.text = l.content[l.cursorPos];
	l.cursorPos++;
	l.charNumber++;

	// If the consumed character is a whitespace character, update the "kind" property of the "token" object to "DiagramTokenKind.WHITE_SPACE" and return it.
	if (/\s/.test(token.text)) {
		token.kind = DiagramTokenKind.WHITE_SPACE;
		// If the consumed character is also a newline character, update the "lineNumber" and "charNumber" properties of the "Lexer" object.
		if (token.text === "\n") {
			l.lineNumber++;
			l.charNumber = 1;
		}
		return token;
	}

	// If the consumed character is not a white space character, but one of the literal tokens, update the "kind" property of the "token" object to the corresponding value in "LITERAL_TOKENS" record and return it.
	if (token.text in LITERAL_TOKENS) {
		token.kind = LITERAL_TOKENS[token.text];
		return token;
	}

	// If the consumed character is not a white space character, and not one of the literal tokens, consume all characters until the next white space character or literal token.
	while (
		l.cursorPos < l.contentLength &&
		!(l.content[l.cursorPos] in LITERAL_TOKENS) &&
		!/\s/.test(l.content[l.cursorPos])
	) {
		token.text += l.content[l.cursorPos];
		l.cursorPos++;
		l.charNumber++;
	}

	// Once a white space character or literal token is encountered, check whether the consumed sequence of characters is a keyword.
	// If it is, update the "kind" property of the "token" object to "DiagramTokenKind.KEYWORD" and return it.
	if (KEYWORDS.includes(token.text)) {
		token.kind = DiagramTokenKind.KEYWORD;
		return token;
	}

	// If the consumed sequence of characters is not a keyword, update the "kind" property of the "token" object to "DiagramTokenKind.SYMBOL" and return it.
	token.kind = DiagramTokenKind.SYMBOL;
	return token;
};

/**
 * The "lexerGetAllTokens" function tokenizes the entire input string at once.
 * The intention is to provide a convenient way to tokenize the entire input string without having to call "lexerGetNextToken" function multiple times.
 */
export const lexerGetAllTokens = (
	l: Lexer,
): DiagramToken[] => {
	const tokens: DiagramToken[] = [];
	let token: DiagramToken;
	// The idea is to call "lexerGetNextToken" function until a token with "EOF" member is returned.
	// The "EOF" token is not included in the returned array.
	do {
		token = lexerGetNextToken(l);
		tokens.push(token);
	} while (token.kind !== DiagramTokenKind.EOF);
	return tokens;
};
