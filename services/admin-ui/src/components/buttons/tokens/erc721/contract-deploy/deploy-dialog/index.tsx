import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { Erc721ContractTemplates, IContract, IErc721ContractDeployDto } from "@framework/types";

import { RoyaltyInput } from "../../../../../inputs/royalty";
import { validationSchema } from "./validation";

export interface IErc721ContractDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form?: any) => Promise<void>;
  initialValues: IErc721ContractDeployDto;
}

export const Erc721ContractDeployDialog: FC<IErc721ContractDeployDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      testId="Erc721ContractDeployForm"
      {...rest}
    >
      <SelectInput name="contractTemplate" options={Erc721ContractTemplates} />
      <TextInput name="name" />
      <TextInput name="symbol" />
      <TextInput name="baseTokenURI" />
      <RoyaltyInput />
    </FormDialog>
  );
};
