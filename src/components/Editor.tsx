import { FC } from "react";

import { Box, useTheme } from "@mui/material";
import ReactCodeMirror from "@uiw/react-codemirror";

type EditorProps = {
	content: string;
	onContentChange: (content: string) => void;
};
export const Editor: FC<EditorProps> = (
	props,
) => {
	const { content, onContentChange } = props;

	const theme = useTheme();

	return (
		<Box
			borderRadius={4}
			padding={2}
			bgcolor={theme.palette.background.paper}
		>
			<ReactCodeMirror
				value={content}
				onChange={onContentChange}
				theme="light"
			/>
		</Box>
	);
};
