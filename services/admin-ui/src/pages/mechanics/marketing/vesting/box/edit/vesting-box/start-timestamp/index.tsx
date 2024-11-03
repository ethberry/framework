import React from "react";
import { useFormContext } from "react-hook-form";

import { IVestingBox } from "@framework/types";

import { DateInput } from "../date";

export const StartTimeStamp = () => {
  const form = useFormContext<IVestingBox>();
  const onChangeHandler = (date: Date | null) => {
    if (!date) {
      return;
    }

    // @ts-ignore
    form.setValue("startTimestamp", date.toISOString());
  };

  return <DateInput name="startTimestamp" onChange={onChangeHandler} required />;
};
