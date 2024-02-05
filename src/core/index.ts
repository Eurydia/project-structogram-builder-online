/**
 * Exposes the lexer and parser to the rest of the application.
 *
 * The "lexerInit" and "lexerGetAllTokens" functions create a lexer and tokenize an input string.
 *
 * The "parserInit" and "parserGetAllNodes" function create a parser and build an abstract syntax tree.
 */
export * from "./lexer";
export * from "./parser";
