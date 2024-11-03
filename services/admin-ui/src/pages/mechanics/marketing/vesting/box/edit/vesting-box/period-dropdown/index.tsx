import React, { useMemo, useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { IVestingBox } from "@framework/types";

import { SelectInput } from "../select";
import { periodOptions, periodShapes, timeValues } from "../constants";
import { optionsFilterByDuration } from "../utils";
import { Time } from "../types";

export const PeriodDropdown = () => {
  const form = useFormContext<IVestingBox>();
  const shape = form.watch("shape");
  const duration = form.watch("duration");

  const isPeriod = periodShapes.includes(shape);

  const filteredPeriodOptions = useMemo(() => {
    const period = form.getValues("period");
    return optionsFilterByDuration(period, duration, form, "period", periodOptions);
  }, [duration]);

  useEffect(() => {
    const period = form.getValues("period");

    if (!isPeriod && !!period) {
      form.unregister("period", { keepDirty: false, keepValue: false });
    }

    if (isPeriod) {
      form.setValue("period", timeValues[Time.ONE_DAY]);
    }
  }, [isPeriod]);

  if (!shape || !isPeriod) {
    return null;
  }

  return <SelectInput name="period" options={filteredPeriodOptions} required />;
};
