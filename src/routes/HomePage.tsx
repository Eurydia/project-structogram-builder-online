import {
	FC,
	useEffect,
	useState,
	SyntheticEvent,
} from "react";
import {
	Box,
	Grid,
	Stack,
	Paper,
	Button,
	Tabs,
	Tab,
	MenuList,
	ListItemText,
	ButtonGroup,
	Popover,
	MenuItem,
	ListItemIcon,
} from "@mui/material";
import {
	DownloadRounded,
	LinkRounded,
} from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import {
	toJpeg,
	toPng,
	toSvg,
} from "html-to-image";
import { saveAs } from "file-saver";
import { useSnackbar } from "notistack";

import {
	lexerGetAllTokens,
	lexerInit,
} from "ast/lexer";
import {
	ASTNode,
	parserGetAllNodes,
	parserInit,
} from "ast/parser";

import { StructogramCodeEditor } from "components/StructogramCodeEditor";
import { StructogramRenderer } from "components/StructogramRenderer";

const copyToClipboard = (
	content: string,
): void => {
	const url = new URL(window.location.href);
	url.searchParams.delete("content");
	url.searchParams.set("content", content);
	navigator.clipboard.writeText(url.toString());
};

export const HomePage: FC = () => {
	const { enqueueSnackbar } = useSnackbar();

	const [
		exportPopoverAnchor,
		setExportPopoverAnchor,
	] = useState<HTMLButtonElement | null>(null);

	const [
		sharePopoverAnchor,
		setSharePopoverAnchor,
	] = useState<HTMLButtonElement | null>(null);

	const [editorTab, setEditorTab] = useState(1);
	const [nodes, setNodes] = useState<ASTNode[]>(
		[],
	);
	const [content, setContent] = useState(() => {
		if (window.location.search !== "") {
			const url = new URL(window.location.href);
			const contentURI =
				url.searchParams.get("content");
			if (contentURI !== null) {
				localStorage.setItem(
					"content",
					contentURI,
				);
				return contentURI;
			}
		}

		const contentURI =
			window.localStorage.getItem("content");
		if (contentURI !== null) {
			return contentURI;
		}
		return "";
	});

	const onContentChange = (v: string) => {
		setContent(v);
		window.localStorage.setItem("content", v);
	};

	const handleSaveSVG = async () => {
		const node = document.getElementById(
			"structogram-preview-region",
		);

		if (node === null) {
			return;
		}

		toSvg(node).then((blob) => {
			if (blob === null) {
				return;
			}

			if (window.saveAs) {
				window.saveAs(blob, "structogram");
			} else {
				saveAs(blob, "structogram");
			}
		});

		enqueueSnackbar("Saved structogram", {
			variant: "info",
		});
	};

	const handleSavePNG = async () => {
		const node = document.getElementById(
			"structogram-preview-region",
		);

		if (node === null) {
			return;
		}

		toPng(node).then((blob) => {
			if (blob === null) {
				return;
			}

			if (window.saveAs) {
				window.saveAs(blob, "structogram");
			} else {
				saveAs(blob, "structogram");
			}
		});

		enqueueSnackbar("Saved structogram", {
			variant: "info",
		});
	};

	const handleSaveJPEG = async () => {
		const node = document.getElementById(
			"structogram-preview-region",
		);

		if (node === null) {
			return;
		}

		toJpeg(node).then((blob) => {
			if (blob === null) {
				return;
			}

			if (window.saveAs) {
				window.saveAs(blob, "structogram");
			} else {
				saveAs(blob, "structogram");
			}
		});

		enqueueSnackbar("Saved structogram", {
			variant: "info",
		});
	};

	const onCopyPreviewLink = () => {
		copyToClipboard(content);
		enqueueSnackbar("Link copied to clipboard", {
			variant: "info",
		});
	};

	const onCopyWorkspaceLink = () => {
		copyToClipboard(content);
		enqueueSnackbar("Link copied to clipboard", {
			variant: "info",
		});
	};

	const handleExportButtonClick = (
		event: React.MouseEvent<HTMLButtonElement>,
	) => {
		setExportPopoverAnchor(event.currentTarget);
	};
	const handleExportPopoverClose = () => {
		setExportPopoverAnchor(null);
	};

	const handleShareButtonClick = (
		event: React.MouseEvent<HTMLButtonElement>,
	) => {
		setSharePopoverAnchor(event.currentTarget);
	};
	const handleSharePopoverClose = () => {
		setSharePopoverAnchor(null);
	};

	const handleEditorTabChange = (
		_: SyntheticEvent<Element, Event>,
		nextTab: number,
	) => {
		setEditorTab(nextTab);
	};

	const handleEditorTabToggle = (
		index: number,
	) => {
		if (editorTab === index) {
			return setEditorTab(0);
		}
	};

	useEffect(() => {
		const nodes: ASTNode[] = parserGetAllNodes(
			parserInit(
				lexerGetAllTokens(lexerInit(content)),
			),
		);
		setNodes(nodes);
	}, [content]);

	return (
		<Box>
			<Paper
				square
				elevation={0}
				sx={{
					padding: 1,
				}}
			>
				<Stack
					display="flex"
					direction="row"
					justifyContent="space-between"
				>
					<Tabs
						value={editorTab}
						onChange={handleEditorTabChange}
					>
						<Tab
							label="Code"
							value={1}
							onClick={() =>
								handleEditorTabToggle(1)
							}
						/>
					</Tabs>
					<ButtonGroup variant="outlined">
						<Button
							onClick={handleExportButtonClick}
						>
							export
						</Button>
						<Button
							onClick={handleShareButtonClick}
						>
							share
						</Button>
					</ButtonGroup>
				</Stack>
				<Popover
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "left",
					}}
					transformOrigin={{
						vertical: "top",
						horizontal: "left",
					}}
					anchorEl={exportPopoverAnchor}
					open={exportPopoverAnchor !== null}
					onClose={handleExportPopoverClose}
				>
					<Paper
						sx={{
							padding: 1,
						}}
					>
						<MenuList>
							<MenuItem onClick={handleSaveJPEG}>
								<ListItemIcon>
									<DownloadRounded fontSize="small" />
								</ListItemIcon>
								<ListItemText>
									Save as JPEG
								</ListItemText>
							</MenuItem>
							<MenuItem onClick={handleSavePNG}>
								<ListItemIcon>
									<DownloadRounded fontSize="small" />
								</ListItemIcon>
								<ListItemText>
									Save as PNG
								</ListItemText>
							</MenuItem>
							<MenuItem onClick={handleSaveSVG}>
								<ListItemIcon>
									<DownloadRounded fontSize="small" />
								</ListItemIcon>
								<ListItemText>
									Save as SVG
								</ListItemText>
							</MenuItem>
						</MenuList>
					</Paper>
				</Popover>
				<Popover
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "left",
					}}
					transformOrigin={{
						vertical: "top",
						horizontal: "left",
					}}
					anchorEl={sharePopoverAnchor}
					open={sharePopoverAnchor !== null}
					onClose={handleSharePopoverClose}
				>
					<Paper
						sx={{
							padding: 1,
						}}
					>
						<MenuList>
							<MenuItem
								onClick={onCopyPreviewLink}
							>
								<ListItemIcon>
									<LinkRounded fontSize="small" />
								</ListItemIcon>
								<ListItemText>
									Copy Preview Link
								</ListItemText>
							</MenuItem>
							<MenuItem
								onClick={onCopyWorkspaceLink}
							>
								<ListItemIcon>
									<LinkRounded fontSize="small" />
								</ListItemIcon>
								<ListItemText>
									Copy Link to Workspace
								</ListItemText>
							</MenuItem>
						</MenuList>
					</Paper>
				</Popover>
			</Paper>
			<Box>
				<Grid container>
					<Grid
						item
						xs={12}
						lg={editorTab === 0 ? 0 : 6}
					>
						{editorTab === 1 && (
							<StructogramCodeEditor
								value={content}
								onValueChange={onContentChange}
								sx={{
									height: "calc(100vh - 64px)",
									overflowY: "auto",
								}}
							/>
						)}
					</Grid>
					<Grid
						item
						xs={12}
						lg={editorTab === 0 ? 12 : 6}
					>
						<StructogramRenderer
							id="structogram-preview-region"
							nodes={nodes}
							sx={{
								padding: 4,
								height: "calc(100vh - 64px)",
								overflowY: "auto",
								backgroundColor: grey[300],
							}}
						/>
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
};
