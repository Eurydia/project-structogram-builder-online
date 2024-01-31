import {
	FC,
	Fragment,
	useCallback,
	useEffect,
	useRef,
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
import { useSnackbar } from "notistack";

import {
	lexerGetAllTokens,
	lexerInit,
	Node,
	parserGetAllNodes,
	parserInit,
} from "interpreter";
import { renderer } from "renderer/renderer";

import { StructogramCodeEditor } from "App/components/StructogramCodeEditor";
import { AdaptiveButton } from "App/components/AdaptiveButton";
import { useExportDiagram } from "App/components/LiveEditor/useExportDiagram";
import { useEditorContent } from "App/components/LiveEditor/useEditorContent";
import { generateUniqueLink } from "App/components/LiveEditor/helperGenerateUniqueLink";

export const LiveEditor: FC = () => {
	const { enqueueSnackbar } = useSnackbar();
	const appBarRef = useRef<HTMLDivElement | null>(
		null,
	);
	const [
		appBarStaticHeight,
		setAppBarStaticHeight,
	] = useState<number>(0);
	const matchBreakpointXs = useMediaQuery<Theme>(
		(theme) => theme.breakpoints.down("md"),
	);

	const { exportJPEG, exportPNG, exportSVG } =
		useExportDiagram(
			"structogram-preview-region",
		);

	const { editorContent, setEditorContent } =
		useEditorContent(
			window.location.href,
			"autosaveContent",
		);

	const [nodes, setNodes] = useState<Node[]>([]);
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

	useEffect(() => {
		if (appBarRef.current === null) {
			return;
		}
		setAppBarStaticHeight(
			appBarRef.current.getBoundingClientRect()
				.height,
		);
	}, [appBarRef]);

	useEffect(() => {
		const tokens = lexerGetAllTokens(
			lexerInit(editorContent),
		);
		const nodes = parserGetAllNodes(
			parserInit(tokens),
		);
		setNodes(nodes);
	}, [editorContent]);

	const handlePreviewToggle = useCallback(() => {
		setPreviewOpen((prev) => !prev);
	}, []);

	const handleCopyLink = useCallback(() => {
		navigator.clipboard.writeText(
			generateUniqueLink(editorContent),
		);
		enqueueSnackbar("Link copied to clipboard", {
			variant: "info",
		});
	}, [enqueueSnackbar, editorContent]);

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

	const handleExportDiagram = async (
		exporterFn: () => Promise<boolean>,
	) => {
		exporterFn().then((success) => {
			if (success) {
				enqueueSnackbar("Diagram exported", {
					variant: "info",
				});
				return;
			}
			enqueueSnackbar(
				"Failed to export diagram",
				{
					variant: "error",
				},
			);
		});
	};

	return (
		<Fragment>
			<Box>
				<Paper
					ref={appBarRef}
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
								onValueChange={setEditorContent}
								boxProps={{
									overflowY: "auto",
									height: `calc(100vh - ${appBarStaticHeight}px)`,
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
									userSelect: "none",
									height: `calc(100vh - ${appBarStaticHeight}px)`,
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
						<MenuItem
							onClick={() =>
								handleExportDiagram(exportJPEG)
							}
						>
							<ListItemIcon>
								<DownloadRounded fontSize="small" />
							</ListItemIcon>
							<ListItemText>
								Save as JPEG
							</ListItemText>
						</MenuItem>
						<MenuItem
							onClick={() =>
								handleExportDiagram(exportPNG)
							}
						>
							<ListItemIcon>
								<DownloadRounded fontSize="small" />
							</ListItemIcon>
							<ListItemText>
								Save as PNG
							</ListItemText>
						</MenuItem>
						<MenuItem
							onClick={() =>
								handleExportDiagram(exportSVG)
							}
						>
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
