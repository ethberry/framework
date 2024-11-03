import {
  FormControl,
  FormHelperText,
  InputLabel,
  InputLabelProps as MuiInputLabelProps,
  Select,
  SelectProps,
  SelectVariants,
} from "@mui/material";
import { useIntl } from "react-intl";
import { Controller, get, useFormContext, useWatch } from "react-hook-form";

import { useTestId } from "@ethberry/provider-test-id";

import { IOption } from "./types";
import { displayItems, displayValue } from "./utils";

export type { IOption };

export type ISelectInputProps<T extends string | number> = {
  name: string;
  options: Record<string, T> | Array<IOption<T>>;
  disabledOptions?: Array<T>;
  InputLabelProps?: Partial<MuiInputLabelProps>;
  variant?: SelectVariants;
} & Omit<SelectProps, "variant">;

export const SelectInput = <T extends string | number>(props: ISelectInputProps<T>) => {
  const {
    options,
    label,
    name,
    multiple,
    variant = "standard",
    disabledOptions = [],
    InputLabelProps = {},
    readOnly,
    required,
    onChange,
    ...rest
  } = props;

  const suffix = name.split(".").pop()!;

  const { testId } = useTestId();
  const testIdProps = testId ? { "data-testid": `${testId}-${name}` } : {};

  const form = useFormContext<any>();
  const formValues = useWatch();

  const withCustomRequiredInputLabelProps = { ...InputLabelProps, required };

  const error = get(form.formState.errors, name);

  const { formatMessage } = useIntl();
  const localizedLabel = label === void 0 ? formatMessage({ id: `form.labels.${suffix}` }) : label;
  const localizedHelperText = error ? formatMessage({ id: error.message }, { label: localizedLabel }) : "";

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormControl fullWidth sx={{ my: 1 }}>
          <InputLabel id={`${name}-select-label`} variant={variant} {...withCustomRequiredInputLabelProps}>
            {localizedLabel}
          </InputLabel>
          <Select
            multiple={multiple}
            labelId={`${name}-select-label`}
            label={localizedLabel}
            id={`${name}-select`}
            variant={variant}
            // @ts-ignore
            renderValue={displayValue(options, formatMessage, suffix, multiple)}
            {...field}
            value={get(formValues, name) ?? ""}
            onChange={(e: any, child: any) => {
              if (onChange) {
                onChange(e, child);
              } else {
                form.setValue(name, e.target.value, { shouldTouch: true, shouldDirty: true });
              }
            }}
            readOnly={readOnly}
            onBlur={() => {
              if (!readOnly) {
                field.onBlur();
              }
            }}
            {...testIdProps}
            {...rest}
          >
            {displayItems(options, disabledOptions, suffix)}
          </Select>

          {localizedHelperText && (
            <FormHelperText id={`${name}-helper-text`} error sx={{ ml: 0 }}>
              {localizedHelperText}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};
