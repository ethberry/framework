import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";
import { LootContractTemplates } from "@framework/types";
import type { IContract, ILootContractDeployDto } from "@framework/types";

import { validationSchema } from "./validation";

export interface ILootContractDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form?: any) => Promise<void>;
  initialValues: ILootContractDeployDto;
}

export const LootContractDeployDialog: FC<ILootContractDeployDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      testId="LootContractDeployForm"
      {...rest}
    >
      <SelectInput name="contractTemplate" options={LootContractTemplates} />
      <TextInput name="name" required />
      <TextInput name="symbol" required />
      <TextInput name="baseTokenURI" required />
      <CurrencyInput name="royalty" symbol="%" required />
    </FormDialog>
  );
};
