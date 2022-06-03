import { FC } from "react";
import { useIntl } from "react-intl";
import NumberFormat from "react-number-format";
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";

import { useStyles } from "./styled";

interface IMaskedInputProps {
  onChange?: (event: { target: { name: string; value: string } }) => void;
  name: string;
  thousandSeparator?: string;
  isNumericString?: boolean;
  prefix?: string;
  decimalSeparator?: string;
  allowNegative?: boolean;
  allowLeadingZeros?: boolean;
  readOnly?: boolean;
  formatValue?: (value: string) => string | number;
  InputLabelProps?: any;
  InputProps?: any;
  defaultValue?: any;
  value?: any;
  displayType?: "input" | "text";
  type?: "text" | "tel" | "password";
  format?: string;
  mask?: string;
  placeholder?: string;
  variant?: "standard" | "filled" | "outlined";
  label?: string;
}

export const MaskedInputWrapper: FC<IMaskedInputProps> = props => {
  const {
    value: _value,
    name,
    label,
    formatValue,
    InputLabelProps,
    InputProps,
    placeholder,
    variant = "standard",
    readOnly,
    ...rest
  } = props;

  const classes = useStyles();

  const form = useFormContext<any>();
  const error = form.formState.errors[name];
  const touched = Boolean(form.formState.touchedFields[name]);

  const suffix = name.split(".").pop() as string;
  const { formatMessage } = useIntl();
  const localizedLabel = label === void 0 ? formatMessage({ id: `form.labels.${suffix}` }) : label;
  const localizedPlaceholder =
    placeholder === void 0 ? formatMessage({ id: `form.placeholders.${suffix}` }) : placeholder;
  const localizedHelperText = error && touched ? formatMessage({ id: error.message }, { label: localizedLabel }) : "";

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field }) => {
        const onValueChange = (values: any) => {
          field.onChange({
            target: {
              name: props.name,
              value: formatValue ? formatValue(values.value) : values.value,
            },
          });
        };

        return (
          <TextField
            classes={classes}
            label={localizedLabel}
            placeholder={localizedPlaceholder}
            helperText={localizedHelperText}
            error={Boolean(error)}
            variant={variant}
            fullWidth
            InputLabelProps={{
              ...InputLabelProps,
              shrink: true,
            }}
            InputProps={{
              ...InputProps,
              readOnly,
              inputComponent: NumberFormat as any,
              inputProps: {
                onValueChange,
                ...rest,
              },
            }}
          />
        );
      }}
    />
  );
};
