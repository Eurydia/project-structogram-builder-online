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
	createTheme,
	GlobalStyles,
	Typography,
} from "@mui/material";
import {
	blue,
	grey,
	pink,
} from "@mui/material/colors";

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

import { StructogramRenderer } from "components/StructogramRenderer";
import { StyledAppBar } from "components/StyledAppBar";
import { StructogramEditor } from "components/StructogramEditor";

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
		return "";
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
			<StyledAppBar />
			<Container
				maxWidth="xl"
				component="main"
			>
				<Box padding={4}>
					<Grid
						container
						spacing={2}
					>
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
								component="section"
							>
								<Typography
									component="h2"
									fontWeight={700}
									variant="h5"
								>
									Editor
								</Typography>
								<StructogramEditor
									content={content}
									onContentChange={onTextChange}
								/>
							</Box>
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
								component="section"
							>
								<Typography
									component="h2"
									fontWeight={700}
									variant="h5"
								>
									Preview
								</Typography>
								<StructogramRenderer
									nodes={nodes}
								/>
							</Box>
						</Grid>
					</Grid>
				</Box>
			</Container>
		</ThemeProvider>
	);
};
