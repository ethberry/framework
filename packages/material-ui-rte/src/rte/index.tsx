import React, { FC, useState } from "react";
import { TextField, TextFieldProps } from "@material-ui/core";
import { getIn, useFormikContext } from "formik";
import { TToolbarControl } from "@gemunion/mui-rte";
import { useIntl } from "react-intl";

import { IRichTextInputProps, RichTextInput } from "../input";

const defaultControls = [
  "title",
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "highlight",
  "undo",
  "redo",
  "numberList",
  "bulletList",
  "clear",
  "save",
];

export interface IRichTextFieldProps {
  name: string;
  customControls?: Array<TToolbarControl>;
}

export const RichTextEditor: FC<IRichTextFieldProps & TextFieldProps> = props => {
  const { id, name, InputLabelProps, customControls = [], ...rest } = props;

  const suffix = name.split(".").pop() as string;

  const formik = useFormikContext<any>();
  const error = getIn(formik.errors, name);
  const touched = getIn(formik.touched, name);
  const value = getIn(formik.values, name);

  // Manually handle the TextField's focused state based on the editor's focused state
  const [isFocused, setIsFocused] = useState(false);

  const { formatMessage } = useIntl();
  const localizedPlaceholder = formatMessage({ id: `form.placeholders.${suffix}` });
  const localizedLabel = formatMessage({ id: `form.labels.${suffix}` });

  const inputProps: IRichTextInputProps = {
    id,
    defaultValue: value,
    label: localizedPlaceholder,
    doFocus: isFocused,
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    onSave: (data: string) => {
      formik.setFieldValue(name, data);
    },
    controls: defaultControls.concat(customControls),
  };

  return (
    <TextField
      id={id}
      name={name}
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
