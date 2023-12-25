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
import {
	generatePath,
	useLocation,
	useParams,
} from "react-router-dom";

export const EditorPage: FC = () => {
	const { enqueueSnackbar } = useSnackbar();
	const { pathname } = useLocation();
	const { content } = useParams();

	const [
		popoverExportMenuAnchor,
		setPopoverExportMenuAnchor,
	] = useState<HTMLButtonElement | null>(null);
	const [
		popoverShareMenuAnchor,
		setPopoverShareMenuAnchor,
	] = useState<HTMLButtonElement | null>(null);

	const [editorOpen, setEditorOpen] =
		useState(true);
	const [nodes, setNodes] = useState<ASTNode[]>(
		[],
	);
	const [editorContent, setEditorContent] =
		useState(() => {
			if (content !== undefined) {
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

	const onContentChange = (v: string) => {
		setEditorContent(v);
		window.localStorage.setItem("content", v);
	};
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

	const handleCopyPreviewLink =
		useCallback(() => {
			const basePath =
				window.location.href.replace(
					pathname,
					"",
				);
			navigator.clipboard.writeText(
				generatePath(
					`${basePath}/preview/:content`,
					{
						content: editorContent ?? "",
					},
				),
			);
			enqueueSnackbar(
				"Copied preview link to clipboard",
				{
					variant: "info",
				},
			);
		}, [
			editorContent,
			pathname,
			enqueueSnackbar,
		]);
	const handleCopyEditorLink = useCallback(() => {
		const basePath = window.location.href.replace(
			pathname,
			"",
		);
		navigator.clipboard.writeText(
			generatePath(
				`${basePath}/editor/:content`,
				{
					content: editorContent ?? "",
				},
			),
		);
		enqueueSnackbar("Link copied to clipboard", {
			variant: "info",
		});
	}, [editorContent, pathname, enqueueSnackbar]);

	const handleEditorToggle = useCallback(() => {
		setEditorOpen((prev) => !prev);
	}, []);

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
	const handlePopoverShareMenuOpen = useCallback(
		(
			event: React.MouseEvent<HTMLButtonElement>,
		) => {
			setPopoverShareMenuAnchor(
				event.currentTarget,
			);
		},
		[],
	);
	const handlePopoverShareMenuClose =
		useCallback(() => {
			setPopoverShareMenuAnchor(null);
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
						<Button
							variant="outlined"
							onClick={handleEditorToggle}
						>
							code
						</Button>
						<ButtonGroup variant="outlined">
							<Button
								onClick={
									handlePopoverExportMenuOpen
								}
							>
								export
							</Button>
							<Button
								onClick={
									handlePopoverShareMenuOpen
								}
							>
								share
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
			<Popover
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
				anchorEl={popoverShareMenuAnchor}
				open={popoverShareMenuAnchor !== null}
				onClose={handlePopoverShareMenuClose}
			>
				<Paper
					square
					sx={{
						padding: 1,
					}}
				>
					<MenuList>
						<MenuItem
							onClick={handleCopyPreviewLink}
						>
							<ListItemIcon>
								<LinkRounded fontSize="small" />
							</ListItemIcon>
							<ListItemText>
								Copy Link to Preview
							</ListItemText>
						</MenuItem>
						<MenuItem
							onClick={handleCopyEditorLink}
						>
							<ListItemIcon>
								<LinkRounded fontSize="small" />
							</ListItemIcon>
							<ListItemText>
								Copy Link to Editor
							</ListItemText>
						</MenuItem>
					</MenuList>
				</Paper>
			</Popover>
		</Fragment>
	);
};
