import { FC } from "react";
import { useIntl } from "react-intl";
import { useFormContext, Controller } from "react-hook-form";
import { TextField, StandardTextFieldProps, FilledTextFieldProps, OutlinedTextFieldProps } from "@mui/material";
import { useDebouncedCallback } from "use-debounce";

import { useStyles } from "./styles";

export interface IStandardTextInputProps extends StandardTextFieldProps {
  name: string;
  readOnly?: boolean;
  onSearch?: (values: any) => void;
  maskedRef?: any;
  updateValue?: (ref: any) => void;
}

export interface IFilledTextInputProps extends FilledTextFieldProps {
  name: string;
  readOnly?: boolean;
  onSearch?: (values: any) => void;
  maskedRef?: any;
  updateValue?: (ref: any) => void;
}

export interface IOutlinedTextInputProps extends OutlinedTextFieldProps {
  name: string;
  readOnly?: boolean;
  onSearch?: (values: any) => void;
  maskedRef?: any;
  updateValue?: (ref: any) => void;
}

export type ITextInputProps = IStandardTextInputProps | IFilledTextInputProps | IOutlinedTextInputProps;

export const TextInput: FC<ITextInputProps> = props => {
  const { name, label, readOnly, InputProps, placeholder, onSearch, variant = "standard", ...rest } = props;
  const classes = useStyles();

  const suffix = name.split(".").pop() as string;

  const form = useFormContext<any>();

  const error = form.formState.errors[name];
  const touched = Boolean(form.formState.touchedFields[name]);

  const { formatMessage } = useIntl();
  const localizedLabel = label === void 0 ? formatMessage({ id: `form.labels.${suffix}` }) : label;
  const localizedPlaceholder =
    placeholder === void 0 ? formatMessage({ id: `form.placeholders.${suffix}` }) : placeholder;
  const localizedHelperText =
    error && error.message && touched ? formatMessage({ id: error.message }, { label: localizedLabel }) : "";

  const debouncedOnChange = useDebouncedCallback(() => {
    onSearch && onSearch(form.getValues());
  });

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field }) => (
        <TextField
          classes={classes}
          label={localizedLabel}
          placeholder={localizedPlaceholder}
          helperText={localizedHelperText}
          error={error}
          variant={variant}
          {...field}
          InputProps={{
            ...InputProps,
            readOnly,
          }}
          fullWidth
          onChange={(event: any) => {
            if (rest.updateValue) {
              rest.updateValue(rest.maskedRef);
            } else {
              field.onChange(event);
            }

            debouncedOnChange();
          }}
          {...rest}
        />
      )}
    />
  );
};
