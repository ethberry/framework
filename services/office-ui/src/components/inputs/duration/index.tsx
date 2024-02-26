import { FC, useCallback } from "react";
import { useIntl } from "react-intl";
import { useWatch } from "react-hook-form";

import { DurationUnit } from "@framework/types";
import { NumberInput } from "@gemunion/mui-inputs-core";

import { formatDuration, normalizeDuration } from "../../../utils/time";

export interface IDurationInput {
  readOnly?: boolean;
}

export const DurationInput: FC<IDurationInput> = props => {
  const { readOnly = false } = props;

  // const form = useFormContext();
  const { formatMessage } = useIntl();

  // const durationAmount: number = useWatch({ name: "durationAmount" });
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
  // const memoizedValue = useMemo(() => normalizeValue(durationAmount), [durationAmount]);
  // useEffect(() => {
  //   form.setValue("durationAmount", formatValue(memoizedValue), { shouldTouch: true });
  // }, [durationUnit]);

  return (
    <NumberInput
      name="durationAmount"
      label={formatMessage({ id: "form.labels.durationInDays" })}
      formatValue={formatValue}
      normalizeValue={normalizeValue}
      onBlur={() => {}}
      // DurationUnit is hidden for now
      // InputProps={{
      //   endAdornment: (
      //     <InputAdornment position="start" sx={{ ml: 1 }}>
      //       <SelectInput
      //         sx={{ width: 90, mr: -1, mb: 2 }}
      //         name="durationUnit"
      //         options={DurationUnit}
      //         readOnly={readOnly}
      //       />
      //     </InputAdornment>
      //   ),
      // }}
      readOnly={readOnly}
    />
  );
};
