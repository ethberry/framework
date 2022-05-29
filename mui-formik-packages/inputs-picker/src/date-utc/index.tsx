import { FC, ReactElement } from "react";
import { useIntl } from "react-intl";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, TextFieldProps } from "@mui/material";
import { DatePicker } from "@mui/lab";
import { addMinutes, subMinutes } from "date-fns";

import { useStyles } from "./styles";

interface IDateUtcInputProps {
  name: string;
  label?: string | number | ReactElement;
  readOnly?: boolean;
  required?: boolean;
  variant?: "standard" | "filled" | "outlined";
  onChange?: (date: Date | null) => void;
}

export const DateUtcInput: FC<IDateUtcInputProps> = props => {
  const { name, label, variant = "standard", ...rest } = props;
  const classes = useStyles();

  const suffix = name.split(".").pop() as string;

  const form = useFormContext<any>();

  const { formatMessage } = useIntl();
  const localizedLabel = label === void 0 ? formatMessage({ id: `form.labels.${suffix}` }) : label;

  const setter = (date: Date | string): Date => {
    const d = new Date(date);
    return addMinutes(d, d.getTimezoneOffset());
  };

  const getter = (date: Date | string): Date => {
    const d = new Date(date);
    return subMinutes(d, d.getTimezoneOffset());
  };

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field }) => (
        <DatePicker
          inputFormat="MM/dd/yyyy"
          label={localizedLabel}
          value={field.value ? setter(field.value) : field.value}
          onChange={(date: Date | null): void => {
            form.setValue(name, date ? getter(date) : date);
          }}
          renderInput={(props: TextFieldProps): ReactElement => (
            <TextField
              className={classes.root}
              name={field.name}
              inputRef={field.ref}
              onBlur={field.onBlur}
              fullWidth
              variant={variant}
              {...props}
            />
          )}
          {...rest}
        />
      )}
    />
  );
};
