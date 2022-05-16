import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { DateInput } from "@gemunion/mui-inputs-picker";
import { IErc20Vesting } from "@framework/types";

import { validationSchema } from "./validation";

export enum Erc20VestingTemplate {
  "LINEAR" = "LINEAR", // 0 -> 25 -> 50 -> 75 -> 100
  "GRADED" = "GRADED", // 0 -> 10 -> 30 -> 60 -> 100
  "CLIFF" = "CLIFF", // 0 -> 100
}

export interface IErc20VestingContractFields {
  contractTemplate: Erc20VestingTemplate;
  beneficiary: string;
  startTimestamp: string;
  duration: number;
}

export interface IErc20VestingDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc20Vesting>, formikBag: any) => Promise<void>;
}

export const Erc20VestingDeployDialog: FC<IErc20VestingDeployDialogProps> = props => {
  const fixedValues: IErc20VestingContractFields = {
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
