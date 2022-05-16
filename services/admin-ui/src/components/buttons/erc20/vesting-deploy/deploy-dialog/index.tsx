import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { DateInput } from "@gemunion/mui-inputs-picker";
import { Erc20VestingTemplate, IErc20Vesting, IErc20VestingDeployDto } from "@framework/types";

import { validationSchema } from "./validation";

export interface IErc20VestingDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc20Vesting>, formikBag: any) => Promise<void>;
}

export const Erc20VestingDeployDialog: FC<IErc20VestingDeployDialogProps> = props => {
  const fixedValues: IErc20VestingDeployDto = {
    contractTemplate: Erc20VestingTemplate.LINEAR,
    beneficiary: "",
    startTimestamp: new Date().toISOString(),
    duration: 30,
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      data-testid="Erc20VestingDeployDialog"
      {...props}
    >
      <SelectInput name="contractTemplate" options={Erc20VestingTemplate} />
      <TextInput name="beneficiary" />
      <DateInput name="startTimestamp" />
      <NumberInput name="duration" />
    </FormDialog>
  );
};
