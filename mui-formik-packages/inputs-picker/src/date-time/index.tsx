import { FC, ReactElement } from "react";
import { useIntl } from "react-intl";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, TextFieldProps } from "@mui/material";
import { DateTimePicker } from "@mui/lab";

import { useStyles } from "./styles";

interface IDateTimeInputProps {
  name: string;
  label?: string | number | ReactElement;
  readOnly?: boolean;
  required?: boolean;
  variant?: "standard" | "filled" | "outlined";
  onChange?: (date: Date | null) => void;
}

export const DateTimeInput: FC<IDateTimeInputProps> = props => {
  const { name, label, variant = "standard", ...rest } = props;
  const classes = useStyles();

  const suffix = name.split(".").pop() as string;

  const form = useFormContext<any>();

  const { formatMessage } = useIntl();
  const localizedLabel = label === void 0 ? formatMessage({ id: `form.labels.${suffix}` }) : label;

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field }) => (
        <DateTimePicker
          inputFormat="MM/dd/yyyy hh:mm a"
          label={localizedLabel}
          value={field.value}
          onChange={field.onChange}
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
