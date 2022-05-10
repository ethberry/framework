import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput, TextInput } from "@gemunion/mui-inputs-core";
import { DateInput } from "@gemunion/mui-inputs-picker";
import { IErc20Vesting } from "@framework/types";
import { EthInput } from "@gemunion/mui-inputs-mask";

import { validationSchema } from "./validation";
import { Erc20TokenInput } from "./token-input";

export interface IErc20VestingDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc20Vesting>, formikBag: any) => Promise<void>;
}

export const Erc20VestingDeployDialog: FC<IErc20VestingDeployDialogProps> = props => {
  const fixedValues = {
    vestingTemplate: "FLAT",
    token: "",
    amount: 0,
    beneficiary: "",
    startTimestamp: new Date(),
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
      <Erc20TokenInput />
      <EthInput name="amount" />
      <TextInput name="beneficiary" />
      <DateInput name="startTimestamp" />
      <NumberInput name="duration" />
    </FormDialog>
  );
};
