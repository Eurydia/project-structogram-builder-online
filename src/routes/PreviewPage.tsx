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
import { DownloadRounded } from "@mui/icons-material";
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

export const PreviewPage: FC = () => {
	const [editorOpen, setEditorOpen] =
		useState(false);
	const [
		popoverExportMenuAnchor,
		setPopoverExportMenuAnchor,
	] = useState<HTMLButtonElement | null>(null);

	const [nodes, setNodes] = useState<ASTNode[]>(
		[],
	);

	const { content } = useParams();
	const { pathname } = useLocation();
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		if (content === undefined) {
			return;
		}

		const nodes: ASTNode[] = parserGetAllNodes(
			parserInit(
				lexerGetAllTokens(lexerInit(content)),
			),
		);
		setNodes(nodes);
	}, [content]);

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
						content: content ?? "",
					},
				),
			);
			enqueueSnackbar(
				"Copied preview link to clipboard",
				{
					variant: "info",
				},
			);
		}, [content, pathname, enqueueSnackbar]);

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

	const handleEditorToggle = useCallback(() => {
		setEditorOpen((prev) => !prev);
	}, []);

	return (
		<Fragment>
			<Box>
				<Paper
					square
					elevation={0}
					sx={{ padding: 1 }}
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
								onClick={handleCopyPreviewLink}
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
								locked
								value={content ?? ""}
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
								emptyText="Nothing to preview."
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
					square
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
