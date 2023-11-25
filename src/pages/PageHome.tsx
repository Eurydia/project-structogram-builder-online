import {
	FC,
	useCallback,
	useEffect,
	useState,
} from "react";
import {
	Box,
	Grid,
	Typography,
	useTheme,
} from "@mui/material";

import {
	lexerGetAllTokens,
	lexerInit,
} from "ast/lexer";
import {
	ASTNode,
	parserGetAllNodes,
	parserInit,
} from "ast/parser";
import { StructogramEditor } from "components/StructogramEditor";
import { StructogramRenderer } from "components/StructogramRenderer";

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
		const nodes: ASTNode[] = parserGetAllNodes(
			parserInit(
				lexerGetAllTokens(lexerInit(content)),
			),
		);
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
						<Typography
							paragraph
							component="p"
						>
							Visit the{" "}
							<a
								href="https://github.com/Eurydia/nassi-shneiderman-diagram-builder-online"
								hrefLang="en"
								target="_blank"
							>
								project GitHub repository
							</a>{" "}
							for more information about the
							syntax.
						</Typography>
						<StructogramEditor
							value={content}
							onValueChange={onTextChange}
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
