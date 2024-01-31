import { FC } from "react";
import { Box, SxProps } from "@mui/material";

import ReactCodeMirror from "@uiw/react-codemirror";

import "./styles.css";

type StructogramCodeEditorProps = {
	value: string;
	onValueChange?: (value: string) => void;
	boxProps?: SxProps;
};
export const StructogramCodeEditor: FC<
	StructogramCodeEditorProps
> = (props) => {
	const { value, onValueChange, boxProps } =
		props;

	return (
		<Box sx={boxProps}>
			<ReactCodeMirror
				value={value}
				onChange={onValueChange}
				theme="dark"
			/>
		</Box>
	);
};
