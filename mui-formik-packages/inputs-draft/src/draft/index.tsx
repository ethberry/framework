import { FC, useState } from "react";
import { TextFieldProps } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import { TToolbarControl } from "@gemunion/mui-rte";
import { TextInput } from "@gemunion/mui-inputs-core";
import { useLicense } from "@gemunion/provider-license";

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
];

export interface IRichTextFieldProps {
  name: string;
  customControls?: Array<TToolbarControl>;
}

export const RichTextEditor: FC<IRichTextFieldProps & TextFieldProps> = props => {
  const { name, InputLabelProps, customControls = [], ...rest } = props;

  const suffix = name.split(".").pop() as string;

  const license = useLicense();
  const form = useFormContext<any>();
  const value = form.getValues(name);

  // Manually handle the TextField's focused state based on the editor's focused state
  const [isFocused, setIsFocused] = useState(false);

  const { formatMessage } = useIntl();
  const localizedPlaceholder = formatMessage({ id: `form.placeholders.${suffix}` });

  const inputProps: IRichTextInputProps = {
    defaultValue: value,
    label: localizedPlaceholder,
    onSave: (data: string) => {
      form.setValue(name, data);
    },
    controls: defaultControls.concat(customControls),
  };

  if (!license.isValid()) {
    return null;
  }

  return (
    <TextInput
      name={name}
      focused={isFocused}
      onClick={() => setIsFocused(true)}
      InputLabelProps={{
        ...InputLabelProps,
        shrink: true,
      }}
      InputProps={{
        inputComponent: RichTextInput,
        inputProps,
      }}
      onChange={() => {}}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...rest}
    />
  );
};
