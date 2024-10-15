import { FC } from "react";

import { FormDialog } from "@ethberry/mui-dialog-form";
import { SelectInput, TextInput } from "@ethberry/mui-inputs-core";
import { CurrencyInput } from "@ethberry/mui-inputs-mask";
import { MysteryContractTemplates } from "@framework/types";
import type { IContract, IMysteryContractDeployDto } from "@framework/types";

import { validationSchema } from "./validation";

export interface IMysteryContractDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form?: any) => Promise<void>;
  initialValues: IMysteryContractDeployDto;
}

export const MysteryContractDeployDialog: FC<IMysteryContractDeployDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      testId="MysteryContractDeployForm"
      {...rest}
    >
      <SelectInput name="contractTemplate" options={MysteryContractTemplates} />
      <TextInput name="name" required />
      <TextInput name="symbol" required />
      <TextInput name="baseTokenURI" required />
      <CurrencyInput name="royalty" symbol="%" required />
    </FormDialog>
  );
};
