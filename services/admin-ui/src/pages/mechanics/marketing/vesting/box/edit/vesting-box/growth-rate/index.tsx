import React, { useLayoutEffect } from "react";
import { useFormContext } from "react-hook-form";

import { CurrencyInput } from "@ethberry/mui-inputs-mask";
import { IVestingBox } from "@framework/types";

import { growthRateShapes } from "../constants";

export const GrowthRate = () => {
  const form = useFormContext<IVestingBox>();
  const shape = form.watch("shape");

  const isGrowthRate = growthRateShapes.includes(shape);

  useLayoutEffect(() => {
    const growthRate = form.getValues("growthRate");

    if (!isGrowthRate && !!growthRate) {
      void form.unregister("growthRate", { keepDirty: false, keepValue: false });
    }
  }, [isGrowthRate]);

  if (!shape || !isGrowthRate) {
    return null;
  }

  return <CurrencyInput name="growthRate" symbol="" required />;
};
