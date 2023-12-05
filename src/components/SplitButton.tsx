import {
	ReactNode,
	FC,
	Fragment,
	useRef,
	useState,
	useCallback,
} from "react";

import {
	Button,
	ButtonGroup,
	ClickAwayListener,
	Grow,
	Paper,
	Popper,
	MenuItem,
	MenuList,
} from "@mui/material";
import { ArrowDropDownRounded } from "@mui/icons-material";

type SplitButtonProps = {
	startIcon: ReactNode;
	text: string;
	onClick: () => void;
	options: {
		text: string;
		onClick: () => void;
	}[];
};
export const SplitButton: FC<SplitButtonProps> = (
	props,
) => {
	const { text, onClick, options, startIcon } =
		props;

	const [optionsOpen, setOptionsOpen] =
		useState<boolean>(false);
	const ref = useRef<HTMLDivElement>(null);

	const handleToggle = useCallback(() => {
		setOptionsOpen((prevOpen) => {
			return !prevOpen;
		});
	}, []);

	const handleClose = useCallback(
		(event: Event) => {
			if (
				ref.current &&
				ref.current.contains(
					event.target as HTMLElement,
				)
			) {
				return;
			}

			setOptionsOpen(false);
		},
		[],
	);

	return (
		<Fragment>
			<ButtonGroup
				disableElevation
				variant="contained"
				ref={ref}
			>
				<Button
					fullWidth
					disableElevation
					size="large"
					startIcon={startIcon}
					onClick={onClick}
				>
					{text}
				</Button>
				<Button
					size="small"
					onClick={handleToggle}
				>
					<ArrowDropDownRounded />
				</Button>
			</ButtonGroup>
			<Popper
				sx={{
					zIndex: 1,
				}}
				open={optionsOpen}
				anchorEl={ref.current}
				role={undefined}
				transition
				disablePortal
			>
				{({ TransitionProps, placement }) => (
					<Grow
						{...TransitionProps}
						style={{
							transformOrigin:
								placement === "bottom"
									? "center top"
									: "center bottom",
						}}
					>
						<Paper>
							<ClickAwayListener
								onClickAway={handleClose}
							>
								<MenuList autoFocusItem>
									{options.map(
										(option, index) => (
											<MenuItem
												key={`${option.text}-${index}`}
												onClick={option.onClick}
											>
												{option.text}
											</MenuItem>
										),
									)}
								</MenuList>
							</ClickAwayListener>
						</Paper>
					</Grow>
				)}
			</Popper>
		</Fragment>
	);
};
