import { FC, Fragment } from "react";
import {
	Box,
	Grid,
	SvgIcon,
	SvgIconProps,
	Typography,
	useTheme,
} from "@mui/material";

import { ASTNode, ASTNodeKind } from "ast/parser";
import { TokenKind } from "ast/lexer";

export const ArrowBottomLeftTopRight: FC<
	SvgIconProps
> = (props) => {
	return (
		<SvgIcon
			sx={{
				position: "absolute",
				width: "100%",
				height: "100%",
			}}
			{...props}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				preserveAspectRatio="none"
				fill="none"
				viewBox="0 0 5 5"
				strokeWidth="0.1"
			>
				<line
					x1="0"
					y1="5"
					x2="5"
					y2="0"
					stroke="currentColor"
					strokeLinecap="round"
				/>
			</svg>
		</SvgIcon>
	);
};

export const ArrowTopLeftBottomRight: FC<
	SvgIconProps
> = (props) => {
	return (
		<SvgIcon
			sx={{
				position: "absolute",
				width: "100%",
				height: "100%",
				...props.sx,
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				preserveAspectRatio="none"
				fill="none"
				viewBox="0 0 5 5"
				strokeWidth="0.1"
			>
				<line
					x1="0"
					y1="0"
					x2="5"
					y2="5"
					stroke="currentColor"
					strokeLinecap="round"
				/>
			</svg>
		</SvgIcon>
	);
};

const MOCK_NODE: ASTNode = {
	kind: ASTNodeKind.PROCESS,
	body: [
		{
			kind: TokenKind.SYMBOL,
			text: "...",
		},
	],
};

type ASTComponentProps = {
	node: ASTNode;

	borderTop?: boolean;
	borderBottom?: boolean;
	borderRight?: boolean;
	borderLeft?: boolean;
};
export const ASTComponent: FC<
	ASTComponentProps
> = (props) => {
	const theme = useTheme();

	const {
		node,
		borderTop,
		borderBottom,
		borderRight,
		borderLeft,
	} = props;

	const paddingSize = 1;

	const borderWidth = 3;
	const backgroundColor =
		theme.palette.background.paper;
	const borderColor = theme.palette.text.primary;

	const sx = {
		backgroundColor,
		borderColor,
		borderStyle: "solid",
		borderLeftWidth: borderLeft ? borderWidth : 0,
		borderTopWidth: borderTop ? borderWidth : 0,
		borderBottomWidth: borderBottom
			? borderWidth
			: 0,
		borderRightWidth: borderRight
			? borderWidth
			: 0,
	};

	if (node.kind === ASTNodeKind.LOOP_FIRST) {
		return (
			<Box sx={{ ...sx }}>
				<Typography
					padding={paddingSize}
					paddingLeft={paddingSize * 2}
					fontFamily="monospace"
					sx={{
						wordWrap: "break-word",
						wordBreak: "break-all",
						lineBreak: "anywhere",
					}}
				>
					{node.control
						.map((t) => t.text)
						.join(" ") || "..."}
				</Typography>
				<Box paddingLeft={paddingSize * 2}>
					{node.body.length > 0 ? (
						node.body.map((n, index) => (
							<ASTComponent
								key={index}
								node={n}
								borderTop
								borderLeft
							/>
						))
					) : (
						<ASTComponent
							node={MOCK_NODE}
							borderTop
							borderLeft
						/>
					)}
				</Box>
			</Box>
		);
	}

	if (node.kind === ASTNodeKind.LOOP_LAST) {
		return (
			<Box sx={{ ...sx }}>
				<Box paddingLeft={paddingSize * 2}>
					{node.body.length > 0 ? (
						node.body.map((n, index) => (
							<ASTComponent
								key={index}
								node={n}
								borderBottom
								borderLeft
							/>
						))
					) : (
						<ASTComponent
							node={MOCK_NODE}
							borderBottom
							borderLeft
						/>
					)}
				</Box>
				<Typography
					padding={paddingSize}
					paddingLeft={paddingSize * 2}
					fontFamily="monospace"
					sx={{
						wordWrap: "break-word",
						wordBreak: "break-all",
						lineBreak: "anywhere",
					}}
				>
					{node.control
						.map((t) => t.text)
						.join(" ") || "..."}
				</Typography>
			</Box>
		);
	}

	if (node.kind === ASTNodeKind.IF_ELSE) {
		return (
			<Box sx={{ ...sx }}>
				<Grid container>
					<Grid
						item
						xs={12}
					>
						<Typography
							display="flex"
							alignItems="center"
							justifyContent="center"
							fontFamily="monospace"
							paddingTop={paddingSize}
							sx={{
								wordWrap: "break-word",
								wordBreak: "break-all",
								lineBreak: "anywhere",
							}}
						>
							{node.control
								.map((t) => t.text)
								.join(" ") || "..."}
						</Typography>
					</Grid>
					<Grid
						item
						xs={6}
					>
						<Typography
							display="flex"
							alignItems="center"
							justifyContent="center"
							fontFamily="monospace"
							padding={paddingSize}
							position="relative"
						>
							<ArrowTopLeftBottomRight color="inherit" />
							<Typography
								sx={{
									zIndex: 1,
									backgroundColor,
								}}
							>
								True
							</Typography>
						</Typography>
					</Grid>
					<Grid
						item
						xs={6}
					>
						<Typography
							component="div"
							display="flex"
							alignItems="center"
							justifyContent="center"
							fontFamily="monospace"
							padding={paddingSize}
							position="relative"
						>
							<ArrowBottomLeftTopRight color="inherit" />
							<Typography
								sx={{
									zIndex: 1,
									backgroundColor,
								}}
							>
								False
							</Typography>
						</Typography>
					</Grid>
					<Grid
						item
						xs={6}
					>
						{node.bodyIf.length > 0 ? (
							node.bodyIf.map((node, index) => (
								<ASTComponent
									key={index}
									node={node}
									borderTop
									borderRight
								/>
							))
						) : (
							<ASTComponent
								node={MOCK_NODE}
								borderTop
								borderRight
							/>
						)}
					</Grid>
					<Grid
						item
						xs={6}
					>
						{node.bodyElse.length > 0 ? (
							node.bodyElse.map((node, index) => (
								<ASTComponent
									key={index}
									node={node}
									borderTop
								/>
							))
						) : (
							<ASTComponent
								node={MOCK_NODE}
								borderTop
							/>
						)}
					</Grid>
				</Grid>
			</Box>
		);
	}

	if (node.kind === ASTNodeKind.PROCESS) {
		return (
			<Box sx={{ ...sx }}>
				<Typography
					padding={paddingSize}
					paddingLeft={paddingSize * 2}
					fontFamily="monospace"
					sx={{
						wordWrap: "break-word",
						wordBreak: "break-all",
						lineBreak: "anywhere",
					}}
				>
					{node.body
						.map((t) => t.text)
						.join(" ") || "..."}
				</Typography>
			</Box>
		);
	}
	return <Fragment />;
};
