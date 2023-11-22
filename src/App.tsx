import { Fragment, useState } from "react";
import {
	Box,
	Container,
	CssBaseline,
	Grid,
	TextField,
} from "@mui/material";
import {
	Lexer,
	Token,
	TokenKind,
	lexerNext,
	lexerInit,
} from "ast/lexer";
import {
	Parser,
	parserNext,
	parserInit,
	ASTNode,
	ASTNodeKind,
} from "ast/parser";
import { ASTNodeComponent } from "ast/renderer";

export const App = () => {
	const [content, setContent] = useState(
		"x := 1;\ny := 2;\nz := x + y;\n\nfor (i=1..3) {x := x + 1;}\ndo {y := y + 1;} while (y < 2);\nwhile(z<3){z := z + 1;}\n\
if (x < y) {y := y + 1} else {z := z + 1;}",
	);

	const tokens: Token[] = [];
	const lexer: Lexer = lexerInit(content);
	let token: Token;
	while (
		(token = lexerNext(lexer)).kind !==
		TokenKind.END
	) {
		tokens.push(token);
	}

	const parser: Parser = parserInit(tokens);

	const nodes: ASTNode[] = [];
	let node: ASTNode;
	while (
		(node = parserNext(parser)).kind !==
		ASTNodeKind.END
	) {
		nodes.push(node);
	}

	return (
		<Fragment>
			<CssBaseline />
			<Container maxWidth="md">
				<Box padding={4}>
					<Grid
						container
						spacing={2}
					>
						<Grid
							item
							xs={12}
						>
							<TextField
								label="Source"
								fullWidth
								multiline
								value={content}
								onChange={(e) =>
									setContent(e.target.value)
								}
								inputProps={{
									spellCheck: false,
									style: {
										fontFamily: "monospace",
									},
								}}
							/>
						</Grid>
						<Grid
							item
							xs={12}
						>
							{nodes.map((node, index) => (
								<ASTNodeComponent
									node={node}
									key={index}
								/>
							))}
						</Grid>
					</Grid>
				</Box>
			</Container>
		</Fragment>
	);
};
