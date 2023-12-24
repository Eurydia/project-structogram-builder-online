import { FC } from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { Box, SxProps } from "@mui/material";

import "./styles.css";

type StructogramEditorProps = {
	value: string;
	onValueChange: (content: string) => void;
	sx?: SxProps;
};
export const StructogramEditor: FC<
	StructogramEditorProps
> = (props) => {
	const { value, onValueChange, sx } = props;

	return (
		<Box sx={sx}>
			<ReactCodeMirror
				value={value}
				onChange={onValueChange}
				theme="dark"
				placeholder="for ( i = 1..3 ) {	x := x + 1; }"
			/>
		</Box>
	);
};
