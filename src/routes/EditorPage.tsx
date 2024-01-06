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
	useMediaQuery,
	Theme,
} from "@mui/material";
import {
	DownloadRounded,
	LaunchRounded,
	SendRounded,
} from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { useSnackbar } from "notistack";
import {
	toJpeg,
	toPng,
	toSvg,
} from "html-to-image";
import { saveAs } from "file-saver";

import {
	lexerGetAllTokens,
	lexerInit,
	Node,
	parserGetAllNodes,
	parserInit,
} from "interpreter";
import { renderer } from "renderer/renderer";

import { StructogramCodeEditor } from "components/StructogramCodeEditor";
import { AdaptiveButton } from "components/AdaptiveButton";

export const EditorPage: FC = () => {
	const { enqueueSnackbar } = useSnackbar();
	const matchBreakpointXs = useMediaQuery<Theme>(
		(theme) => theme.breakpoints.down("md"),
	);

	const [
		popoverExportMenuAnchor,
		setPopoverExportMenuAnchor,
	] = useState<HTMLButtonElement | null>(null);

	const [previewOpen, setPreviewOpen] = useState(
		() => {
			const url = new URL(window.location.href);
			const preview =
				url.searchParams.get("preview");
			if (preview === null) {
				return false;
			}

			return preview === "true";
		},
	);
	const [nodes, setNodes] = useState<Node[]>([]);
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
		const tokens = lexerGetAllTokens(
			lexerInit(editorContent),
		);
		const nodes = parserGetAllNodes(
			parserInit(tokens),
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

	const handlePreviewToggle = useCallback(() => {
		setPreviewOpen((prev) => !prev);
	}, []);

	const handleCopyLink = useCallback(() => {
		const url = new URL(window.location.href);
		url.searchParams.set("preview", "true");
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
								onClick={handlePreviewToggle}
							>
								{previewOpen
									? "Show code"
									: "Hide code"}
							</Button>
							<Button
								href="https://eurydia.github.io/project-nassi-shneiderman-diagram-builder-online-docs/"
								component="a"
								target="_blank"
								endIcon={<LaunchRounded />}
							>
								docs
							</Button>
						</ButtonGroup>
						<ButtonGroup variant="outlined">
							<AdaptiveButton
								collapse={matchBreakpointXs}
								startIcon={<DownloadRounded />}
								onClick={
									handlePopoverExportMenuOpen
								}
							>
								EXPORT
							</AdaptiveButton>
							<AdaptiveButton
								collapse={matchBreakpointXs}
								endIcon={<SendRounded />}
								onClick={handleCopyLink}
							>
								SHARE
							</AdaptiveButton>
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
								previewOpen ? "none" : undefined
							}
						>
							<StructogramCodeEditor
								value={editorContent}
								onValueChange={onContentChange}
								boxProps={{
									overflowY: "auto",
									height:
										"calc(100vh - 61.6833px)",
								}}
							/>
						</Grid>
						<Grid
							item
							xs
							lg
							display={
								matchBreakpointXs && !previewOpen
									? "none"
									: undefined
							}
						>
							{renderer(
								nodes,
								"structogram-preview-region",
								{
									padding: 4,
									overflowY: "auto",
									backgroundColor: grey[300],
									height:
										"calc(100vh - 61.6833px)",
								},
							)}
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
