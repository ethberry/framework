import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput, TextInput } from "@gemunion/mui-inputs-core";
import { DateInput } from "@gemunion/mui-inputs-picker";
import type { IContract, IVestingContractDeployDto } from "@framework/types";

import { validationSchema } from "./validation";

export interface IVestingDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
}

export const VestingDeployDialog: FC<IVestingDeployDialogProps> = props => {
  const fixedValues: IVestingContractDeployDto = {
    beneficiary: "",
    startTimestamp: new Date().toISOString(),
    cliffInMonth: 12,
    monthlyRelease: 1000,
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      testId="VestingDeployForm"
      {...props}
    >
      <TextInput name="account" />
      <DateInput name="startTimestamp" />
      <NumberInput name="cliffInMonth" />
      <NumberInput name="monthlyRelease" />
    </FormDialog>
  );
};
