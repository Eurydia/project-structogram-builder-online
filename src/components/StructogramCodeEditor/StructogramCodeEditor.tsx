import { FC } from "react";
import { Box, SxProps } from "@mui/material";

import ReactCodeMirror from "@uiw/react-codemirror";

import "./styles.css";

type StructogramCodeEditorProps = {
	locked?: boolean;
	placeholder?: string;
	value: string;
	onValueChange?: (value: string) => void;
	sx?: SxProps;
};
export const StructogramCodeEditor: FC<
	StructogramCodeEditorProps
> = (props) => {
	const {
		value,
		onValueChange,
		sx,
		locked,
		placeholder,
	} = props;

	return (
		<Box sx={sx}>
			<ReactCodeMirror
				readOnly={locked}
				value={value}
				onChange={onValueChange}
				theme="dark"
				placeholder={placeholder}
			/>
		</Box>
	);
};
