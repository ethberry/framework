import { FC, ReactElement } from "react";
import { useIntl } from "react-intl";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, TextFieldProps } from "@mui/material";
import { DatePicker } from "@mui/lab";

import { useStyles } from "./styles";

interface IDateInputProps {
  name: string;
  label?: string | number | ReactElement;
  readOnly?: boolean;
  required?: boolean;
  variant?: "standard" | "filled" | "outlined";
  onChange?: (date: Date | null) => void;
}

export const DateInput: FC<IDateInputProps> = props => {
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
        <DatePicker
          inputFormat="MM/dd/yyyy"
          label={localizedLabel}
          {...field}
          renderInput={(props: TextFieldProps): ReactElement => (
            <TextField className={classes.root} inputRef={field.ref} fullWidth variant={variant} {...props} />
          )}
          {...rest}
        />
      )}
    />
  );
};
