import {
	useCallback,
	useEffect,
	useState,
} from "react";
import {
	Box,
	Container,
	CssBaseline,
	Grid,
	ThemeProvider,
	Typography,
	createTheme,
	GlobalStyles,
} from "@mui/material";
import {
	blue,
	grey,
	pink,
} from "@mui/material/colors";

import ReactCodeMirror from "@uiw/react-codemirror";

import {
	Lexer,
	Token,
	TokenKind,
	lexerNext,
	lexerInit,
} from "ast/lexer";
import {
	Parser,
	parserGetNextNodeThenAdvance,
	parserInit,
	ASTNode,
	ASTNodeKind,
} from "ast/parser";
import { ASTComponent } from "components/ASTComponent";

const theme = createTheme({
	palette: {
		mode: "light",
		primary: {
			main: blue[200],
		},
		secondary: {
			main: pink[300],
		},
		text: {
			primary: grey[800],
		},
	},
});

const globalStyles = (
	<GlobalStyles
		styles={{
			body: {
				backgroundColor:
					theme.palette.primary.main,
			},
		}}
	/>
);

export const App = () => {
	const [nodes, setNodes] = useState<ASTNode[]>(
		[],
	);
	const [content, setContent] = useState(() => {
		const savedContent: null | string =
			window.localStorage.getItem("content");
		if (savedContent !== null) {
			return savedContent;
		}
		return "x := 1;\ny := 2;\nz := x + y;\n\nfor (i=1..3) {x := x + 1;}\ndo {y := y + 1;} while (y < 2);\nwhile(z<3){z := z + 1;}\n\
if (x < y) {y := y + 1} else {z := z + 1;}";
	});

	const onTextChange = useCallback(
		(v: string) => {
			setContent(v);
			window.localStorage.setItem("content", v);
		},
		[],
	);

	useEffect(() => {
		const lexer: Lexer = lexerInit(content);
		const tokens: Token[] = [];
		let token: Token;
		while (
			(token = lexerNext(lexer)).kind !==
			TokenKind.END
		) {
			tokens.push(token);
		}
		console.log(content);
		console.log(tokens);

		const parser: Parser = parserInit(tokens);

		const nodes: ASTNode[] = [];
		let node: ASTNode;
		while (
			(node =
				parserGetNextNodeThenAdvance(parser))
				.kind !== ASTNodeKind.END
		) {
			nodes.push(node);
		}

		setNodes(nodes);
	}, [content]);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{globalStyles}
			<Container maxWidth="xl">
				<Box padding={4}>
					<Grid
						container
						spacing={2}
					>
						<Grid
							item
							xs={12}
						>
							<Typography
								variant="h4"
								borderRadius={4}
								padding={2}
								bgcolor={
									theme.palette.background.paper
								}
							>
								<a
									hrefLang="en"
									target="_blank"
									href="https://en.wikipedia.org/wiki/Nassi%E2%80%93Shneiderman_diagram"
								>
									Structogram
								</a>{" "}
								Builder
							</Typography>
						</Grid>
						<Grid
							item
							xs={6}
						>
							<Box
								borderRadius={4}
								padding={2}
								bgcolor={
									theme.palette.background.paper
								}
							>
								<ReactCodeMirror
									value={content}
									onChange={onTextChange}
									theme="light"
								/>
							</Box>
						</Grid>
						<Grid
							item
							xs={6}
						>
							<Box
								borderRadius={4}
								padding={4}
								bgcolor={
									theme.palette.background.paper
								}
							>
								{nodes.length > 0 ? (
									nodes.map((node, index) => (
										<ASTComponent
											key={index}
											node={node}
											borderLeft
											borderTop
											borderRight
											borderBottom={
												index === nodes.length - 1
											}
										/>
									))
								) : (
									<Typography fontStyle="italic">
										Start typing to see the
										preview.
									</Typography>
								)}
							</Box>
						</Grid>
					</Grid>
				</Box>
			</Container>
		</ThemeProvider>
	);
};
