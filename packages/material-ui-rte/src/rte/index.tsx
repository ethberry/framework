import React, {FC, useState} from "react";
import {TextField, TextFieldProps} from "@material-ui/core";
import {getIn, useFormikContext} from "formik";
import {TToolbarControl} from "@paktolus/mui-rte";
import {useIntl} from "react-intl";
import {convertToRaw, EditorState} from "draft-js";
import {useDebouncedCallback} from "use-debounce";

import {IRichTextInputProps, RichTextInput} from "../input";

const defaultControls = [
  "title",
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "highlight",
  "undo",
  "redo",
  "link",
  "numberList",
  "bulletList",
  "quote",
  "code",
  "clear",
  "media",
];

export interface IRichTextFieldProps {
  name: string;
  controls?: Array<TToolbarControl>;
}

export const RichTextEditor: FC<IRichTextFieldProps & TextFieldProps> = props => {
  const {id, name, defaultValue, InputLabelProps, controls = defaultControls, ...rest} = props;

  const suffix = name.split(".").pop() as string;

  const formik = useFormikContext<any>();
  const error = getIn(formik.errors, name);
  const touched = getIn(formik.touched, name);
  const value = getIn(formik.values, name);

  // Manually handle the TextField's focused state based on the editor's focused state
  const [isFocused, setIsFocused] = useState(false);

  const {formatMessage} = useIntl();
  const localizedPlaceholder = formatMessage({id: `form.placeholders.${suffix}`});
  const localizedLabel = formatMessage({id: `form.labels.${suffix}`});

  const debounced = useDebouncedCallback((state: EditorState) => {
    const content = state.getCurrentContent();
    const rawObject = convertToRaw(content);
    formik.setFieldValue(name, JSON.stringify(rawObject));
  }, 1000);

  const inputProps: IRichTextInputProps = {
    id,
    defaultValue,
    label: localizedPlaceholder,
    onStateChange: debounced,
    doFocus: isFocused,
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    controls,
  };

  return (
    <TextField
      id={id}
      name={name}
      value={value}
      error={error && touched}
      label={localizedLabel}
      placeholder={localizedPlaceholder}
      focused={isFocused}
      onClick={() => setIsFocused(true)}
      InputLabelProps={{
        ...InputLabelProps,
        shrink: true,
      }}
      InputProps={{
        inputComponent: RichTextInput,
        inputProps: inputProps,
      }}
      fullWidth
      {...rest}
    />
  );
};
