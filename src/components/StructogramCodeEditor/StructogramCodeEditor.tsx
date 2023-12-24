import { FC } from "react";
import { Box, SxProps } from "@mui/material";

import ReactCodeMirror from "@uiw/react-codemirror";

import "./styles.css";

type StructogramCodeEditorProps = {
	previewOnly?: boolean;
	value: string;
	onValueChange: (content: string) => void;
	sx?: SxProps;
};
export const StructogramCodeEditor: FC<
	StructogramCodeEditorProps
> = (props) => {
	const {
		value,
		onValueChange,
		sx,
		previewOnly,
	} = props;

	return (
		<Box sx={sx}>
			<ReactCodeMirror
				readOnly={previewOnly}
				value={value}
				onChange={onValueChange}
				theme="dark"
				placeholder="for ( i = 1..3 ) {	x := x + 1; }"
			/>
		</Box>
	);
};
