import { LaunchRounded } from "@mui/icons-material";
import {
	Box,
	Button,
	ButtonGroup,
	Grid,
	Paper,
	Theme,
	styled,
	useMediaQuery,
} from "@mui/material";
import {
	FC,
	ReactNode,
	useMemo,
	useRef,
	useState,
} from "react";
import { getPreviewState } from "~components/LiveEditor/helper";

const StyledPaper = styled(Paper)(
	({ theme }) => ({
		padding: theme.spacing(1),
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
	}),
);
const StyledBox = styled(Box)({
	overflow: "auto",
});
const docsButton = (
	<Button
		href="https://eurydia.github.io/project-structogram-builder-online-docs/"
		component="a"
		target="_blank"
		endIcon={<LaunchRounded />}
		children="docs"
	/>
);

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

	const panelHeight = useMemo(
		() => `calc(100vh - ${appBarHeight}px)`,
		[appBarHeight],
	);

	const toggleCodeMsg = leftPanelOpen
		? "Show code"
		: "Hide code";

	const rightPanelVisible =
		matchBreakpointXs && !leftPanelOpen
			? "none"
			: undefined;

	const leftPanelVisible = leftPanelOpen
		? "none"
		: undefined;

	return (
		<StyledBox>
			<StyledPaper
				ref={appBarRef}
				square
				elevation={4}
			>
				<ButtonGroup
					disableElevation
					variant="outlined"
				>
					<Button
						onClick={handlePreviewToggle}
						children={toggleCodeMsg}
					/>
					{docsButton}
				</ButtonGroup>
				{slotAppBar}
			</StyledPaper>
			<Grid container>
				<Grid
					item
					xs={12}
					lg={6}
					display={leftPanelVisible}
				>
					<StyledBox
						height={panelHeight}
						children={slotPanelLeft}
					/>
				</Grid>
				<Grid
					item
					xs
					lg
					display={rightPanelVisible}
				>
					<StyledBox
						height={panelHeight}
						children={slotPanelRight}
					/>
				</Grid>
			</Grid>
		</StyledBox>
	);
};
