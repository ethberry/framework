import { FC } from "react";

import { FormDialog } from "@ethberry/mui-dialog-form";
import { NumberInput, TextInput } from "@ethberry/mui-inputs-core";
import { DateInput } from "@ethberry/mui-inputs-picker";
import { CurrencyInput } from "@ethberry/mui-inputs-mask";
import type { IContract, IVestingContractDeployDto } from "@framework/types";

import { validationSchema } from "./validation";

export interface IVestingDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
  initialValues: IVestingContractDeployDto;
}

export const VestingDeployDialog: FC<IVestingDeployDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { owner, startTimestamp, cliffInMonth, monthlyRelease } = initialValues;

  const fixedValues = {
    owner,
    startTimestamp,
    cliffInMonth,
    monthlyRelease,
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      testId="VestingDeployForm"
      {...rest}
    >
      <TextInput name="owner" required />
      <DateInput name="startTimestamp" />
      <NumberInput name="cliffInMonth" required />
      <CurrencyInput name="monthlyRelease" symbol="%" required />
    </FormDialog>
  );
};
