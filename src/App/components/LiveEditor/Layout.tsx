import {
	FC,
	ReactNode,
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

/**
 * This component defines the layout and its behavior for the "LiveEditor" component.
 *
 * There are behaviors for different screen sizes.
 * At small screen sizes, both panels are not displayed side by side.
 * Instead, a panel takes up the entire screen and the other panel is hidden.
 * At medium and large screen sizes, the both panels are displayed side by side.
 */
type LayoutProps = {
	slotAppBar: ReactNode;
	slotPanelLeft: ReactNode;
	slotPanelRight: ReactNode;
};
export const Layout: FC<LayoutProps> = (
	props,
) => {
	const {
		slotAppBar,
		slotPanelLeft,
		slotPanelRight,
	} = props;

	// Prepare the app bar reference
	const appBarRef = useRef<HTMLDivElement | null>(
		null,
	);

	// Prepare the app bar static height
	// This is used to calculate the height of the left and right panels in the layout
	// Without a fixed height, the panels have unpredictable behavior
	let appBarHeight = 0;
	if (appBarRef.current !== null) {
		appBarHeight =
			appBarRef.current.getBoundingClientRect()
				.height;
	}

	// The left panel can be hidden or shown
	// The initial state is determined by the query parameter in the URL
	const [leftPanelOpen, setLeftPanelOpen] =
		useState(
			getPreviewState(window.location.href),
		);

	// Fires when the "Show Code" and "Hide Code" button is clicked
	const handlePreviewToggle = () => {
		setLeftPanelOpen((prev) => !prev);
	};

	// The breakpoint for the extra small screen
	const matchBreakpointXs = useMediaQuery<Theme>(
		(theme) => theme.breakpoints.down("md"),
	);

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
							{leftPanelOpen
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
							leftPanelOpen ? "none" : undefined
						}
					>
						<Box
							overflow="auto"
							height={`calc(100vh - ${appBarHeight}px)`}
						>
							{slotPanelLeft}
						</Box>
					</Grid>
					<Grid
						item
						xs
						lg
						display={
							matchBreakpointXs && !leftPanelOpen
								? "none"
								: undefined
						}
					>
						<Box
							overflow="auto"
							height={`calc(100vh - ${appBarHeight}px)`}
						>
							{slotPanelRight}
						</Box>
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
};
