import ReactCodeMirror, {
	EditorView,
} from "@uiw/react-codemirror";
import { FC } from "react";
import "./styles.css";

/**
 * This component is a styled code editor.
 * It uses the "react-codemirror" library.
 */
type StyledCodeEditorProps = {
	value: string;
	onValueChange: (value: string) => void;
};
export const StyledCodeEditor: FC<
	StyledCodeEditorProps
> = (props) => {
	const { value, onValueChange } = props;

	return (
		<ReactCodeMirror
			value={value}
			onChange={onValueChange}
			theme="dark"
			extensions={[EditorView.lineWrapping]}
		/>
	);
};
