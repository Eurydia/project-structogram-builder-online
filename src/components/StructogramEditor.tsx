import { FC } from "react";

import ReactCodeMirror from "@uiw/react-codemirror";
import { Box } from "@mui/material";

type StructogramEditorProps = {
	content: string;
	onContentChange: (content: string) => void;
};
export const StructogramEditor: FC<
	StructogramEditorProps
> = (props) => {
	const { content, onContentChange } = props;

	return (
		<Box padding={2}>
			<ReactCodeMirror
				value={content}
				onChange={onContentChange}
				theme="light"
				placeholder="for ( i = 1..3 ) {	x := x + 1; }"
			/>
		</Box>
	);
};
