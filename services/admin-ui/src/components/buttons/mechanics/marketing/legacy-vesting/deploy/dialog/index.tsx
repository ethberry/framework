import { FC } from "react";

import { FormDialog } from "@ethberry/mui-dialog-form";
import { NumberInput, SelectInput, TextInput } from "@ethberry/mui-inputs-core";
import { DateInput } from "@ethberry/mui-inputs-picker";
import { CurrencyInput } from "@ethberry/mui-inputs-mask";
import type { IContract, ILegacyVestingContractDeployDto } from "@framework/types";
import { LegacyVestingContractTemplates } from "@framework/types";

import { validationSchema } from "./validation";

export interface ILegacyVestingDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
  initialValues: ILegacyVestingContractDeployDto;
}

export const LegacyVestingDeployDialog: FC<ILegacyVestingDeployDialogProps> = props => {
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
      <SelectInput name="contractTemplate" options={LegacyVestingContractTemplates} />
      <TextInput name="owner" required />
      <DateInput name="startTimestamp" />
      <NumberInput name="cliffInMonth" required />
      <CurrencyInput name="monthlyRelease" symbol="%" required />
    </FormDialog>
  );
};
