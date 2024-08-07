import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { DateInput } from "@gemunion/mui-inputs-picker";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";
import type { IContract, IVestingContractDeployDto } from "@framework/types";
import { VestingContractTemplates } from "@framework/types";

import { validationSchema } from "./validation";

export interface IVestingDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
  initialValues: IVestingContractDeployDto;
}

export const VestingDeployDialog: FC<IVestingDeployDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { owner, startTimestamp, cliffInMonth, monthlyRelease, contractTemplate } = initialValues;

  const fixedValues = {
    owner,
    startTimestamp,
    cliffInMonth,
    monthlyRelease,
    contractTemplate,
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      testId="VestingDeployForm"
      {...rest}
    >
      <SelectInput name="contractTemplate" options={VestingContractTemplates} />
      <TextInput name="owner" required />
      <DateInput name="startTimestamp" />
      <NumberInput name="cliffInMonth" required />
      <CurrencyInput name="monthlyRelease" symbol="%" required />
    </FormDialog>
  );
};
