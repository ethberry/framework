import { forwardRef } from "react";
import { InputBaseComponentProps } from "@mui/material/InputBase";
import { EditorState } from "draft-js";
import { IRichTextEditorRef, RichTextEditor, TToolbarControl } from "@gemunion/mui-rte";

export interface IRichTextInputProps extends Omit<InputBaseComponentProps, "value"> {
  onStateChange?: (state: EditorState) => void;
  controls?: Array<TToolbarControl>;
}

export const RichTextInput = forwardRef<IRichTextEditorRef, IRichTextInputProps>((props, ref) => {
  const { onStateChange, ...rest } = props;
  return <RichTextEditor onChange={onStateChange} {...rest} ref={ref} />;
});
