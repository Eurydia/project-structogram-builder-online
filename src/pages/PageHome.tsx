import {
	FC,
	useCallback,
	useEffect,
	useState,
	Fragment,
} from "react";
import {
	Box,
	Grid,
	Typography,
	useTheme,
	Snackbar,
	Stack,
} from "@mui/material";
import {
	DownloadRounded,
	EditRounded,
	ImageRounded,
} from "@mui/icons-material";
import {
	toJpeg,
	toPng,
	toSvg,
} from "html-to-image";
import { saveAs } from "file-saver";

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
import { DropdownButton } from "components/DropdownButton";

const copyToClipboard = (
	content: string,
	preview: boolean,
): void => {
	const url = new URL(window.location.href);
	url.searchParams.set("content", content);
	if (preview) {
		url.searchParams.set("preview", "true");
	}

	navigator.clipboard.writeText(url.toString());
};

export const PageHome: FC = () => {
	const theme = useTheme();

	const [editorOpen] = useState<boolean>(() => {
		if (window.location.search !== "") {
			const url = new URL(window.location.href);
			const previewParam =
				url.searchParams.get("preview");
			if (previewParam === null) {
				return true;
			}

			if (previewParam === "true") {
				return false;
			}
			return true;
		}

		return true;
	});

	const [snackbarURLOpen, setSnackbarURLOpen] =
		useState<boolean>(false);
	const [
		snackbarDownloadOpen,
		setSnackbarDownloadOpen,
	] = useState<boolean>(false);
	const [nodes, setNodes] = useState<ASTNode[]>(
		[],
	);
	const [content, setContent] = useState(() => {
		if (window.location.search !== "") {
			const url = new URL(window.location.href);
			const contentParam =
				url.searchParams.get("content");
			if (contentParam !== null) {
				localStorage.setItem(
					"content",
					contentParam,
				);
				return contentParam;
			}
		}

		const content =
			window.localStorage.getItem("content");
		if (content !== null) {
			return content;
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

	const onImageSaveSVG = useCallback(async () => {
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

		setSnackbarDownloadOpen(true);
	}, []);

	const onImageSavePNG = useCallback(async () => {
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

		setSnackbarDownloadOpen(true);
	}, []);

	const onImageSaveJPEG =
		useCallback(async () => {
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

			setSnackbarDownloadOpen(true);
		}, []);

	const onCopyLinkReadonly = useCallback(() => {
		copyToClipboard(content, true);
		setSnackbarURLOpen(true);
	}, [content]);

	const onCopyLink = useCallback(() => {
		copyToClipboard(content, false);
		setSnackbarURLOpen(true);
	}, [content]);

	useEffect(() => {
		const nodes: ASTNode[] = parserGetAllNodes(
			parserInit(
				lexerGetAllTokens(lexerInit(content)),
			),
		);
		setNodes(nodes);
	}, [content]);

	return (
		<Fragment>
			<Box
				padding={1}
				component="section"
			>
				<Typography
					borderRadius={4}
					bgcolor={
						theme.palette.background.default
					}
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
						display={
							editorOpen ? "block" : "none"
						}
						item
						xs={12}
						lg={6}
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
						lg={editorOpen ? 6 : 12}
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
							<div
								id="structogram-preview-region"
								style={{
									paddingTop: theme.spacing(2),
									paddingBottom: theme.spacing(2),
								}}
							>
								<StructogramRenderer
									nodes={nodes}
								/>
							</div>
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
				</Grid>
			</Box>
			<Snackbar
				open={snackbarURLOpen}
				autoHideDuration={3000}
				onClose={() => setSnackbarURLOpen(false)}
				message="Link copied to clipboard"
			/>
			<Snackbar
				open={snackbarDownloadOpen}
				autoHideDuration={3000}
				onClose={() =>
					setSnackbarDownloadOpen(false)
				}
				message="Saved structogram"
			/>
		</Fragment>
	);
};
