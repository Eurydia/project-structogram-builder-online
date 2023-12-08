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
	ClickAwayListener,
	Grow,
	Paper,
	Popper,
	MenuItem,
	MenuList,
	Stack,
	Typography,
} from "@mui/material";

type DropdownButtonProps = {
	children: ReactNode;
	options: {
		icon: ReactNode;
		text: string;
		onClick: () => void;
	}[];
};
export const DropdownButton: FC<
	DropdownButtonProps
> = (props) => {
	const { children, options } = props;

	const [optionsOpen, setOptionsOpen] =
		useState<boolean>(false);
	const ref = useRef<HTMLButtonElement | null>(
		null,
	);

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
			<Button
				ref={ref}
				disableElevation
				variant="contained"
				onClick={handleToggle}
			>
				{children}
			</Button>
			<Popper
				open={optionsOpen}
				anchorEl={ref.current}
				transition
				disablePortal
				sx={{
					zIndex: (theme) => theme.zIndex.modal,
				}}
			>
				{({ TransitionProps }) => (
					<Grow {...TransitionProps}>
						<Paper elevation={4}>
							<ClickAwayListener
								onClickAway={handleClose}
							>
								<MenuList autoFocusItem>
									{options.map(
										(
											{ text, onClick, icon },
											index,
										) => (
											<MenuItem
												key={`${text}-${index}`}
												onClick={onClick}
											>
												<Stack
													spacing={1}
													direction="row"
												>
													{icon}
													<Typography>
														{text}
													</Typography>
												</Stack>
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
