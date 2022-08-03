import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { DateInput } from "@gemunion/mui-inputs-picker";
import { IVesting, IVestingDeployDto, VestingContractTemplate } from "@framework/types";

import { validationSchema } from "./validation";

export interface IVestingDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IVesting>, form: any) => Promise<void>;
}

export const VestingDeployDialog: FC<IVestingDeployDialogProps> = props => {
  const fixedValues: IVestingDeployDto = {
    contractTemplate: VestingContractTemplate.LINEAR,
    account: "",
    startTimestamp: new Date().toISOString(),
    duration: 30,
  };

  const testIdPrefix = "VestingDeployForm";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      testId={testIdPrefix}
      {...props}
    >
      <SelectInput
        name="contractTemplate"
        options={VestingContractTemplate}
      />
      <TextInput name="account" />
      <DateInput name="startTimestamp" />
      <NumberInput name="duration" />
    </FormDialog>
  );
};
