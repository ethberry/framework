import React, { useEffect, useMemo } from "react";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";

import { IVestingBox } from "@framework/types";
import { CurrencyInput } from "@ethberry/mui-inputs-mask";

import { Time } from "../types";
import { SelectInput } from "../select";
import { afterCliffBasisPointsShapes, cliffOptions, cliffShapes, immediateShapes, timeValues } from "../constants";
import { optionsFilterByDuration } from "../utils";

export const Cliff = () => {
  const form = useFormContext<IVestingBox>();
  const { formatMessage } = useIntl();
  const shape = form.watch("shape");
  const duration = form.watch("duration");

  const isCliff = cliffShapes.includes(shape);
  const isAfterCliffBasisPoints = afterCliffBasisPointsShapes.includes(shape);

  const afterCliffPercentLabel = immediateShapes.includes(shape)
    ? formatMessage({ id: "form.labels.immediateUnlockPercent" })
    : formatMessage({ id: "form.labels.afterCliffBasisPoints" });

  const filteredCliffOptions = useMemo(() => {
    const cliff = form.getValues("cliff");
    return optionsFilterByDuration(cliff, duration, form, "cliff", cliffOptions);
  }, [duration]);

  useEffect(() => {
    const cliff = form.getValues("cliff");
    const afterCliffBasisPoints = form.getValues("afterCliffBasisPoints");

    if (!isAfterCliffBasisPoints && !!afterCliffBasisPoints) {
      void form.unregister("afterCliffBasisPoints", { keepDirty: false, keepValue: false });
    }

    if (!isCliff && !!cliff) {
      void form.unregister("cliff", { keepDirty: false, keepValue: false });
    }

    if (isCliff) {
      void form.setValue("cliff", timeValues[Time.MONTH], { shouldTouch: true, shouldDirty: true });
    }
  }, [isCliff, isAfterCliffBasisPoints]);

  return (
    <React.Fragment>
      {shape && isCliff && <SelectInput name="cliff" options={filteredCliffOptions} required />}
      {shape && isAfterCliffBasisPoints && (
        <CurrencyInput name="afterCliffBasisPoints" symbol="%" label={afterCliffPercentLabel} required />
      )}
    </React.Fragment>
  );
};
