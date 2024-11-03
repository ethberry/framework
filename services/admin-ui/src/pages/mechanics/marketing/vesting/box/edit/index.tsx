import React, { FC } from "react";
import { FormDialog } from "@ethberry/mui-dialog-form";

import type { IVestingBox } from "@framework/types";

import { VestingBoxForm, validationSchema } from "./vesting-box";


export interface IVestingBoxEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IVestingBox>, form: any) => Promise<void>;
  initialValues: IVestingBox;
}

export const VestingBoxEditDialog: FC<IVestingBoxEditDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;

  const {
    id,
    title,
    description,
    content,
    imageUrl,
    vestingBoxStatus,
    template,
    shape,
    cliff,
    startTimestamp,
    duration,
    period,
    afterCliffBasisPoints,
    growthRate,
  } = initialValues;

  const fixedValues = {
    id,
    title,
    description,
    content,
    imageUrl,
    vestingBoxStatus,
    template,
    shape,
    cliff,
    startTimestamp,
    duration,
    period,
    afterCliffBasisPoints,
    growthRate,
  };

  const confirmHandler = async (values: Partial<IVestingBox>, form: any) => {
    const preparedValues = {
      ...values,
      period: values.period || 1,
      growthRate: values.growthRate || 1,
      cliff: values.cliff || 0,
      afterCliffPercent: values.afterCliffBasisPoints || 0,
    };
    await onConfirm(preparedValues, form);
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="VestingBoxEditForm"
      onConfirm={confirmHandler}
      {...rest}
    >
      <VestingBoxForm id={id} />
    </FormDialog>
  );
};
