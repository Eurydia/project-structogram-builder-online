import {
	Box,
	Grid,
	Typography,
	useTheme,
} from "@mui/material";
import {
	Token,
	TokenKind,
	lexerInit,
	lexerNext,
} from "ast/lexer";
import {
	ASTNode,
	ASTNodeKind,
	parserGetNextNodeThenAdvance,
	parserInit,
} from "ast/parser";
import { StructogramEditor } from "components/StructogramEditor";
import { StructogramRenderer } from "components/StructogramRenderer";
import {
	FC,
	useCallback,
	useEffect,
	useState,
} from "react";

export const PageHome: FC = () => {
	const theme = useTheme();
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
		const lexer = lexerInit(content);
		const tokens: Token[] = [];
		let token: Token;
		while (
			(token = lexerNext(lexer)).kind !==
			TokenKind.END
		) {
			tokens.push(token);
		}

		const parser = parserInit(tokens);

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
		<Box
			padding={4}
			component="section"
		>
			<Typography
				borderRadius={4}
				bgcolor={theme.palette.background.default}
				padding={2}
				fontWeight={700}
				component="h1"
				variant="h4"
				marginBottom={2}
			>
				Builder
			</Typography>
			<Grid
				container
				spacing={2}
			>
				<Grid
					item
					xs={12}
					sm={6}
				>
					<Box
						component="section"
						borderRadius={4}
						padding={2}
						bgcolor={
							theme.palette.background.paper
						}
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
					xs={12}
					sm={6}
				>
					<Box
						component="section"
						borderRadius={4}
						padding={2}
						bgcolor={
							theme.palette.background.paper
						}
					>
						<Typography
							component="h2"
							fontWeight={700}
							variant="h5"
						>
							Preview
						</Typography>
						<StructogramRenderer nodes={nodes} />
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
};
