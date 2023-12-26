import {
	FC,
	Fragment,
	useCallback,
	useEffect,
	useState,
} from "react";
import {
	Box,
	Grid,
	Stack,
	Paper,
	Button,
	MenuList,
	ListItemText,
	ButtonGroup,
	Popover,
	MenuItem,
	ListItemIcon,
} from "@mui/material";
import {
	DownloadRounded,
	SendRounded,
	VisibilityOffRounded,
	VisibilityRounded,
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
} from "compiler/lexer";
import {
	ASTNode,
	parserGetAllNodes,
	parserInit,
} from "compiler/parser";

import { StructogramCodeEditor } from "components/StructogramCodeEditor";
import { StructogramRenderer } from "components/StructogramRenderer";

export const EditorPage: FC = () => {
	const { enqueueSnackbar } = useSnackbar();

	const [
		popoverExportMenuAnchor,
		setPopoverExportMenuAnchor,
	] = useState<HTMLButtonElement | null>(null);

	const [editorOpen, setEditorOpen] =
		useState(true);
	const [nodes, setNodes] = useState<ASTNode[]>(
		[],
	);
	const [editorContent, setEditorContent] =
		useState(() => {
			const url = new URL(window.location.href);
			const content =
				url.searchParams.get("content");
			if (content !== null) {
				window.localStorage.setItem(
					"content",
					content,
				);
				return content;
			}

			const savedContent =
				window.localStorage.getItem("content");
			if (savedContent !== null) {
				return savedContent;
			}
			return "";
		});

	useEffect(() => {
		const nodes: ASTNode[] = parserGetAllNodes(
			parserInit(
				lexerGetAllTokens(
					lexerInit(editorContent),
				),
			),
		);
		setNodes(nodes);
	}, [editorContent]);

	const onContentChange = useCallback(
		(v: string) => {
			setEditorContent(v);
			window.localStorage.setItem("content", v);
		},
		[],
	);
	const handleSaveSVG = useCallback(async () => {
		const HTMLNode = document.getElementById(
			"structogram-preview-region",
		);
		if (HTMLNode === null) {
			return;
		}
		toSvg(HTMLNode).then((blob) => {
			if (blob === null) {
				return;
			}
			if (window.saveAs) {
				window.saveAs(blob, "structogram");
			} else {
				saveAs(blob, "structogram");
			}
		});
		enqueueSnackbar("Saved structogram as SVG", {
			variant: "info",
		});
	}, [enqueueSnackbar]);

	const handleSavePNG = useCallback(async () => {
		const HTMLNode = document.getElementById(
			"structogram-preview-region",
		);
		if (HTMLNode === null) {
			return;
		}
		toPng(HTMLNode).then((blob) => {
			if (blob === null) {
				return;
			}
			if (window.saveAs) {
				window.saveAs(blob, "structogram");
			} else {
				saveAs(blob, "structogram");
			}
		});
		enqueueSnackbar("Saved structogram as PNG", {
			variant: "info",
		});
	}, [enqueueSnackbar]);

	const handleSaveJPEG = useCallback(async () => {
		const HTMLNode = document.getElementById(
			"structogram-preview-region",
		);
		if (HTMLNode === null) {
			return;
		}
		toJpeg(HTMLNode).then((blob) => {
			if (blob === null) {
				return;
			}
			if (window.saveAs) {
				window.saveAs(blob, "structogram");
			} else {
				saveAs(blob, "structogram");
			}
		});
		enqueueSnackbar("Saved structogram as JPEG", {
			variant: "info",
		});
	}, [enqueueSnackbar]);

	const handleEditorToggle = useCallback(() => {
		setEditorOpen((prev) => !prev);
	}, []);

	const handleCopyLink = useCallback(() => {
		const url = new URL(window.location.href);
		url.searchParams.set(
			"content",
			editorContent,
		);
		navigator.clipboard.writeText(url.href);
		enqueueSnackbar("Copied link to clipboard", {
			variant: "info",
		});
	}, [editorContent, enqueueSnackbar]);

	const handlePopoverExportMenuOpen = useCallback(
		(
			event: React.MouseEvent<HTMLButtonElement>,
		) => {
			setPopoverExportMenuAnchor(
				event.currentTarget,
			);
		},
		[],
	);
	const handlePopoverExportMenuClose =
		useCallback(() => {
			setPopoverExportMenuAnchor(null);
		}, []);

	return (
		<Fragment>
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
						<ButtonGroup variant="outlined">
							<Button
								onClick={handleEditorToggle}
								startIcon={
									editorOpen ? (
										<VisibilityRounded />
									) : (
										<VisibilityOffRounded />
									)
								}
							>
								code
							</Button>
						</ButtonGroup>
						<ButtonGroup variant="outlined">
							<Button
								startIcon={<DownloadRounded />}
								onClick={
									handlePopoverExportMenuOpen
								}
							>
								export
							</Button>
							<Button
								endIcon={<SendRounded />}
								onClick={handleCopyLink}
							>
								Share
							</Button>
						</ButtonGroup>
					</Stack>
				</Paper>
				<Box>
					<Grid container>
						<Grid
							item
							xs={12}
							lg={6}
							display={
								editorOpen ? undefined : "none"
							}
						>
							<StructogramCodeEditor
								placeholder="for ( i = 1..3 ) {	x := x + 1; }"
								value={editorContent}
								onValueChange={onContentChange}
								sx={{
									height: "calc(100vh - 62px)",
									overflowY: "auto",
								}}
							/>
						</Grid>
						<Grid
							item
							xs
							lg
						>
							<StructogramRenderer
								id="structogram-preview-region"
								nodes={nodes}
								sx={{
									padding: 4,
									height: "calc(100vh - 62px)",
									overflowY: "auto",
									backgroundColor: grey[300],
								}}
							/>
						</Grid>
					</Grid>
				</Box>
			</Box>
			<Popover
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
				anchorEl={popoverExportMenuAnchor}
				open={popoverExportMenuAnchor !== null}
				onClose={handlePopoverExportMenuClose}
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
		</Fragment>
	);
};
