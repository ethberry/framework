import { useFormContext } from "react-hook-form";

import { IVestingBox, ShapeType } from "@framework/types";

import { SelectInput } from "../select";
import { afterCliffBasisPointsShapes, growthRateShapes } from "../constants";

export const ShapeDropdown = () => {
  const form = useFormContext<IVestingBox>();
  const onChange = (e: any) => {
    const value = e.target.value;

    if (growthRateShapes.includes(value as ShapeType)) {
      // @ts-ignore
      form.setValue("growthRate", 200, { shouldTouch: true, shouldDirty: true });
    }

    if (afterCliffBasisPointsShapes.includes(value as ShapeType)) {
      form.setValue("afterCliffBasisPoints", 2500, { shouldTouch: true, shouldDirty: true });
    }

    form.setValue("shape", value as ShapeType, { shouldTouch: true, shouldDirty: true });
  };

  return <SelectInput name="shape" options={ShapeType} onChange={onChange} required />;
};
