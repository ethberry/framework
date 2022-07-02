import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { DateInput } from "@gemunion/mui-inputs-picker";
import { VestingTemplate, IVesting, IVestingDeployDto } from "@framework/types";

import { validationSchema } from "./validation";

export interface IVestingDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IVesting>, form: any) => Promise<void>;
}

export const VestingDeployDialog: FC<IVestingDeployDialogProps> = props => {
  const fixedValues: IVestingDeployDto = {
    contractTemplate: VestingTemplate.LINEAR,
    beneficiary: "",
    startTimestamp: new Date().toISOString(),
    duration: 30,
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      data-testid="VestingDeployDialog"
      {...props}
    >
      <SelectInput name="contractTemplate" options={VestingTemplate} />
      <TextInput name="beneficiary" />
      <DateInput name="startTimestamp" />
      <NumberInput name="duration" />
    </FormDialog>
  );
};
