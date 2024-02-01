import {
	FC,
	Fragment,
	useEffect,
	useState,
} from "react";

import {
	Paper,
	MenuList,
	ListItemText,
	ButtonGroup,
	Popover,
	MenuItem,
	ListItemIcon,
	Theme,
	useMediaQuery,
} from "@mui/material";
import {
	DownloadRounded,
	SendRounded,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";

import {
	lexerGetAllTokens,
	lexerInit,
	DiagramNode,
	parserGetAllNodes,
	parserInit,
} from "interpreter";

import { DiagramPreview } from "App/components/DiagramPreview";
import { StyledCodeEditor } from "App/components/StyledCodeEditor";
import { AdaptiveButton } from "App/components/AdaptiveButton";

import { Layout } from "./Layout";
import { useExportDiagram } from "./useExportDiagram";
import { useEditorContent } from "./useEditorContent";
import { generateUniqueLink } from "./helper";

export const LiveEditor: FC = () => {
	const { enqueueSnackbar } = useSnackbar();
	const { exportJPEG, exportPNG, exportSVG } =
		useExportDiagram(
			"structogram-preview-region",
		);
	const { editorContent, setEditorContent } =
		useEditorContent(
			window.location.href,
			"autosaveContent",
		);
	const matchBreakpointXs = useMediaQuery<Theme>(
		(theme) => theme.breakpoints.down("md"),
	);

	const [nodes, setNodes] = useState<
		DiagramNode[]
	>([]);
	const [
		popoverExportMenuAnchor,
		setPopoverExportMenuAnchor,
	] = useState<HTMLButtonElement | null>(null);

	useEffect(() => {
		const tokens = lexerGetAllTokens(
			lexerInit(editorContent),
		);
		const nodes = parserGetAllNodes(
			parserInit(tokens),
		);
		setNodes(nodes);
	}, [editorContent]);

	const handleCopyLink = () => {
		navigator.clipboard.writeText(
			generateUniqueLink(
				editorContent,
				window.location.href,
			),
		);
		enqueueSnackbar("Link copied to clipboard", {
			variant: "info",
		});
	};

	const handlePopoverExportMenuOpen = (
		event: React.MouseEvent<HTMLButtonElement>,
	) => {
		setPopoverExportMenuAnchor(
			event.currentTarget,
		);
	};
	const handlePopoverExportMenuClose = () => {
		setPopoverExportMenuAnchor(null);
	};

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
			<Layout
				slotAppBar={
					<ButtonGroup variant="outlined">
						<AdaptiveButton
							collapsed={matchBreakpointXs}
							startIcon={<DownloadRounded />}
							onClick={
								handlePopoverExportMenuOpen
							}
						>
							EXPORT
						</AdaptiveButton>
						<AdaptiveButton
							collapsed={matchBreakpointXs}
							endIcon={<SendRounded />}
							onClick={handleCopyLink}
						>
							SHARE
						</AdaptiveButton>
					</ButtonGroup>
				}
				slotPanelLeft={
					<StyledCodeEditor
						value={editorContent}
						onValueChange={setEditorContent}
					/>
				}
				slotPanelRight={
					<DiagramPreview
						nodes={nodes}
						id="structogram-preview-region"
						boxProps={{
							padding: 4,
							userSelect: "none",
						}}
					/>
				}
			/>
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
