import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { IContract, IPonziContractDeployDto, PonziContractTemplates } from "@framework/types";

import { validationSchema } from "./validation";

export interface IPonziContractDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form?: any) => Promise<void>;
}

export const PonziContractDeployDialog: FC<IPonziContractDeployDialogProps> = props => {
  const fixedValues: IPonziContractDeployDto = {
    contractTemplate: PonziContractTemplates.SIMPLE,
    payees: [],
    shares: [],
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      testId="PonziContractDeployForm"
      {...props}
    >
      <SelectInput name="contractTemplate" options={PonziContractTemplates} />
      <TextInput name="payees" />
      <TextInput name="shares" />
    </FormDialog>
  );
};
