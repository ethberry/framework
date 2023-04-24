import { FC } from "react";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { useIntl } from "react-intl";
import { Controller, get, useFormContext, useWatch } from "react-hook-form";

import { useTestId } from "@gemunion/provider-test-id";

import { capitalize } from "../utils";

export interface ISelectInputProps {
  name: string;
  options: string[];
  prefix: string;
  disabledOptions?: string[];
}

export const SelectInput: FC<ISelectInputProps> = props => {
  const { disabledOptions = [], name, options = [], prefix } = props;

  const suffix = name.split(".").pop() as string;

  const { testId } = useTestId();
  const testIdProps = testId ? { "data-testid": `${testId}-${name}` } : {};

  const form = useFormContext<any>();
  const formValues = useWatch();

  const error = get(form.formState.errors, `${prefix}.${name}`);

  const { formatMessage } = useIntl();
  const localizedLabel = formatMessage({ id: `form.labels.${suffix}` });
  const localizedHelperText = error ? formatMessage({ id: error.message }, { label: localizedLabel }) : "";

  return (
    <Controller
      name={`${prefix}.${name}`}
      control={form.control}
      render={({ field }) => (
        <FormControl fullWidth sx={{ my: 1 }}>
          <InputLabel id={`${name}-select-label`} variant="standard">
            {localizedLabel}
          </InputLabel>
          <Select
            labelId={`${name}-select-label`}
            label={localizedLabel}
            id={`${name}-select`}
            variant="standard"
            renderValue={(value: string) => capitalize(value)}
            {...field}
            value={get(formValues, `${prefix}.${name}`)}
            onChange={(e: any) => {
              form.setValue(`${prefix}.${name}`, e.target.value, { shouldTouch: true, shouldDirty: true });
            }}
            {...testIdProps}
          >
            {options.map((option, i) => (
              <MenuItem value={option} key={i} disabled={disabledOptions.includes(option)}>
                {capitalize(option)}
              </MenuItem>
            ))}
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
