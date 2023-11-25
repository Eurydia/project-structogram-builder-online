import { FC } from "react";

import ReactCodeMirror from "@uiw/react-codemirror";
import { Box } from "@mui/material";

type StructogramEditorProps = {
	readOnly?: boolean;
	value?: string;
	onValueChange?: (content: string) => void;
};
export const StructogramEditor: FC<
	StructogramEditorProps
> = (props) => {
	const { value, onValueChange, readOnly } =
		props;

	const _value = value ?? "";
	const _onValueChange =
		onValueChange ?? (() => {});

	return (
		<Box padding={2}>
			<ReactCodeMirror
				readOnly={readOnly}
				value={_value}
				onChange={_onValueChange}
				theme="light"
				placeholder="for ( i = 1..3 ) {	x := x + 1; }"
			/>
		</Box>
	);
};
