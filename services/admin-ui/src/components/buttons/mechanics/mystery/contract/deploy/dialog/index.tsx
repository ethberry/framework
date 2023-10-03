import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";
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
      <TextInput name="name" />
      <TextInput name="symbol" />
      <TextInput name="baseTokenURI" />
      <CurrencyInput name="royalty" symbol="%" />
    </FormDialog>
  );
};
