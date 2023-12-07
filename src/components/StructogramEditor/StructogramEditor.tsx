import { FC } from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { Box } from "@mui/material";

import "./styles.css";

type StructogramEditorProps = {
	value: string;
	onValueChange: (content: string) => void;
};
export const StructogramEditor: FC<
	StructogramEditorProps
> = (props) => {
	const { value, onValueChange } = props;

	return (
		<Box>
			<ReactCodeMirror
				value={value}
				onChange={onValueChange}
				theme="light"
				placeholder="for ( i = 1..3 ) {	x := x + 1; }"
			/>
		</Box>
	);
};
