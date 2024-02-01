import {
	FC,
	ReactNode,
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
	useMediaQuery,
	Theme,
	ButtonGroup,
} from "@mui/material";
import { getPreviewState } from "App/components/LiveEditor/helper";
import { LaunchRounded } from "@mui/icons-material";

type LayoutProps = {
	slotAppBar: ReactNode;
	slotPanelRight: ReactNode;
	slotPanelLeft: ReactNode;
};
export const Layout: FC<LayoutProps> = (
	props,
) => {
	const {
		slotAppBar,
		slotPanelLeft,
		slotPanelRight,
	} = props;

	const appBarRef = useRef<HTMLDivElement | null>(
		null,
	);
	const [
		appBarStaticHeight,
		setAppBarStaticHeight,
	] = useState(0);

	const [previewOpen, setPreviewOpen] = useState(
		getPreviewState(window.location.href),
	);
	const handlePreviewToggle = () => {
		setPreviewOpen((prev) => !prev);
	};

	const matchBreakpointXs = useMediaQuery<Theme>(
		(theme) => theme.breakpoints.down("md"),
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

	return (
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
						<Button onClick={handlePreviewToggle}>
							{previewOpen
								? "Show code"
								: "Hide code"}
						</Button>{" "}
						<Button
							href="https://eurydia.github.io/project-nassi-shneiderman-diagram-builder-online-docs/"
							component="a"
							target="_blank"
							endIcon={<LaunchRounded />}
						>
							docs
						</Button>
					</ButtonGroup>
					{slotAppBar}
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
						<Box
							overflow="auto"
							height={`calc(100vh - ${appBarStaticHeight}px)`}
						>
							{slotPanelLeft}
						</Box>
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
						<Box
							overflow="auto"
							height={`calc(100vh - ${appBarStaticHeight}px)`}
						>
							{slotPanelRight}
						</Box>
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
};
