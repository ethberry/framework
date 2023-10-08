import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput, TextInput } from "@gemunion/mui-inputs-core";
import { DateInput } from "@gemunion/mui-inputs-picker";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";
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

  const { beneficiary, startTimestamp, cliffInMonth, monthlyRelease } = initialValues;

  const fixedValues = {
    beneficiary,
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
      <TextInput name="beneficiary" />
      <DateInput name="startTimestamp" />
      <NumberInput name="cliffInMonth" />
      <CurrencyInput name="monthlyRelease" symbol="%" />
    </FormDialog>
  );
};
