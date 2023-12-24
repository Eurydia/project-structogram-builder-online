import {
	FC,
	useEffect,
	useState,
	SyntheticEvent,
} from "react";
import {
	Box,
	Grid,
	Typography,
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
import { StructogramEditor } from "components/StructogramEditor";
import { StructogramRenderer } from "components/StructogramRenderer";
import { grey } from "@mui/material/colors";

const copyToClipboard = (
	content: string,
	preview: boolean,
): void => {
	const url = new URL(window.location.href);
	url.searchParams.set("content", content);

	if (preview) {
		url.searchParams.set("preview", "true");
	} else {
		url.searchParams.delete("preview");
	}

	navigator.clipboard.writeText(url.toString());
};

export const Home: FC = () => {
	const { enqueueSnackbar } = useSnackbar();

	const [
		exportPopoverAnchor,
		setExportPopoverAnchor,
	] = useState<HTMLButtonElement | null>(null);

	const [
		sharePopoverAnchor,
		setSharePopoverAnchor,
	] = useState<HTMLButtonElement | null>(null);

	const [editorTab, setEditorTab] = useState(
		() => {
			if (window.location.search !== "") {
				const url = new URL(window.location.href);
				const previewParam =
					url.searchParams.get("preview");
				if (
					previewParam !== null &&
					previewParam === "true"
				) {
					return 0;
				}
			}
			return 1;
		},
	);
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
		copyToClipboard(content, true);
		enqueueSnackbar("Link copied to clipboard", {
			variant: "info",
		});
	};

	const onCopyWorkspaceLink = () => {
		copyToClipboard(content, false);
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
						{/* <Tab
							label="DnD"
							value={2}
							onClick={() =>
								handleEditorTabToggle(2)
							}
						/> */}
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
							<StructogramEditor
								value={content}
								onValueChange={onContentChange}
								sx={{
									height: "calc(100vh - 64px)",
									overflowY: "auto",
								}}
							/>
						)}
						{editorTab === 2 && (
							<Typography>Hi</Typography>
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
								backgroundColor: grey[100],
							}}
						/>
					</Grid>
				</Grid>
			</Box>

			{/* <Typography
				borderRadius={4}
				bgcolor={palette.background.default}
				padding={2}
				fontWeight={700}
				component="h1"
				variant="h4"
				marginBottom={2}
			>
				<a
					target="_blank"
					hrefLang="en"
					href="https://en.wikipedia.org/wiki/Nassi%E2%80%93Shneiderman_diagram"
				>
					Structogram
				</a>{" "}
				builder
			</Typography>
			<Grid
				container
				spacing={2}
			>
				<Grid
					display={editorOpen ? "block" : "none"}
					item
					xs={12}
					lg={6}
				>
					<Box
						component="section"
						borderRadius={4}
						padding={2}
						bgcolor={palette.background.paper}
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
							onValueChange={onContentChange}
						/>
					</Box>
				</Grid>
				<Grid
					item
					xs={12}
					lg={editorOpen ? 6 : 12}
				>
					<Box
						component="section"
						borderRadius={4}
						padding={2}
						bgcolor={palette.background.paper}
					>
						<Typography
							component="h2"
							fontWeight={700}
							variant="h5"
						>
							Preview
						</Typography>
						<Box
							sx={{
								width: "100%",
								[breakpoints.up("md")]: {
									width: !editorOpen
										? "60%"
										: undefined,
									marginX: !editorOpen
										? "auto"
										: undefined,
								},
							}}
						>
							<div
								id="structogram-preview-region"
								style={{
									paddingTop: spacing(2),
									paddingBottom: spacing(2),
								}}
							>
								<StructogramRenderer
									nodes={nodes}
								/>
							</div>
						</Box>
						<Stack
							spacing={2}
							direction="row"
						>
							<DropdownButton
								options={[
									{
										icon: <EditRounded />,
										text: "Include editor",
										onClick: onCopyLink,
									},
									{
										icon: <ImageRounded />,
										text: "Preview only",
										onClick: onCopyLinkReadonly,
									},
								]}
							>
								Share
							</DropdownButton>
							<DropdownButton
								options={[
									{
										icon: <DownloadRounded />,
										text: "Save as SVG",
										onClick: onImageSaveSVG,
									},
									{
										icon: <DownloadRounded />,
										text: "Save as PNG",
										onClick: onImageSavePNG,
									},
									{
										icon: <DownloadRounded />,
										text: "Save as JPG",
										onClick: onImageSaveJPEG,
									},
								]}
							>
								Export
							</DropdownButton>
						</Stack>
					</Box>
				</Grid>
			</Grid> */}
		</Box>
	);
};
