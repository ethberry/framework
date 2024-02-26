import { FC, useCallback, useEffect, useMemo } from "react";
import { InputAdornment } from "@mui/material";
import { useFormContext, useWatch } from "react-hook-form";

import { DurationUnit } from "@framework/types";
import { NumberInput, SelectInput } from "@gemunion/mui-inputs-core";

import { formatDuration, normalizeDuration } from "../../../utils/time";

export interface IDurationInput {
  readOnly?: boolean;
}

export const DurationInput: FC<IDurationInput> = props => {
  const { readOnly = false } = props;

  const form = useFormContext();

  const durationAmount: number = useWatch({ name: "durationAmount" });
  const durationUnit: DurationUnit = useWatch({ name: "durationUnit" });

  const normalizeValue = useCallback(
    (durationAmount: number): number => {
      return normalizeDuration({ durationAmount, durationUnit });
    },
    [durationUnit],
  );

  const formatValue = useCallback(
    (durationAmount: number): number => {
      return formatDuration({ durationAmount, durationUnit });
    },
    [durationUnit],
  );

  // memoize value to handle changing durationUnit
  // and setting correct value to the form according to the new durationUnit
  const memoizedValue = useMemo(() => normalizeValue(durationAmount), [durationAmount]);
  useEffect(() => {
    form.setValue("durationAmount", formatValue(memoizedValue), { shouldTouch: true });
  }, [durationUnit]);

  return (
    <NumberInput
      name="durationAmount"
      formatValue={formatValue}
      normalizeValue={normalizeValue}
      onBlur={() => {}}
      InputProps={{
        endAdornment: (
          <InputAdornment position="start" sx={{ ml: 1 }}>
            <SelectInput
              sx={{ width: 90, mr: -1, mb: 2 }}
              name="durationUnit"
              options={DurationUnit}
              readOnly={readOnly}
            />
          </InputAdornment>
        ),
      }}
      readOnly={readOnly}
    />
  );
};
