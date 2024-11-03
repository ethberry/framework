import { FC, ReactElement } from "react";
import { useIntl } from "react-intl";
import { Controller, get, useFormContext, useWatch } from "react-hook-form";
import { MobileDatePicker, MobileDatePickerProps } from "@mui/x-date-pickers";

import { useTestId } from "@ethberry/provider-test-id";

interface IDateInputProps extends MobileDatePickerProps<any> {
  name: string;
  label?: string | number | ReactElement;
  readOnly?: boolean;
  required?: boolean;
  textFieldSlotProps?: any;
  variant?: "standard" | "filled" | "outlined";
  onChange?: (date: Date | null) => void;
}

export const DateInput: FC<IDateInputProps> = props => {
  const { name, label, variant = "standard", readOnly, textFieldSlotProps = {}, onChange, required, ...rest } = props;

  const { testId } = useTestId();
  const testIdProps = testId ? { "data-testid": `${testId}-${name}` } : {};

  const suffix = name.split(".").pop() as string;

  const form = useFormContext<any>();
  const error = get(form.formState.errors, name);
  const value = useWatch({ name });

  const { formatMessage } = useIntl();
  const localizedLabel = label === void 0 ? formatMessage({ id: `form.labels.${suffix}` }) : label;
  const localizedHelperText = error ? formatMessage({ id: error.message }, { label: localizedLabel }) : "";

  const setter = (value: number): Date => {
    /** value is seconds from UNIX epoch **/
    return new Date(value * 1000);
  };

  const getter = (date: Date | string): string => {
    const isDateString = !isNaN(Date.parse(date as string));
    return isDateString ? new Date(date).toISOString() : (date as string);
  };

  const onChangeDate = (date: Date | null) => {
    if (onChange) {
      onChange(date);
    } else {
      form.setValue(name, date ? getter(date) : date, { shouldDirty: true, shouldTouch: true });
    }
  };

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field }) => (
        <MobileDatePicker
          format="dd/MM/yyyy"
          label={localizedLabel}
          value={value ? setter(value) : null}
          onChange={onChangeDate}
          ref={field.ref}
          slotProps={{
            textField: {
              sx: { my: 1 },
              fullWidth: true,
              variant,
              required,
              name: field.name,
              onBlur: field.onBlur,
              helperText: localizedHelperText,
              error: !!error,
              inputProps: {
                readOnly,
                ...testIdProps,
              },
              ...textFieldSlotProps,
            },
          }}
          {...rest}
        />
      )}
    />
  );
};
