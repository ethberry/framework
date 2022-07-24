import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";

import { validationSchema } from "./validation";
import { ContractInput } from "./contract-input";
import { TemplateInput } from "./template-input";

export interface IErc1155MintDto {
  address: string;
  contractId: number;
  templateId: number;
  amount: string;
  account: string;
}

export interface IErc1155MintDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IErc1155MintDto, form: any) => Promise<void>;
  initialValues: IErc1155MintDto;
}

export const Erc1155MintDialog: FC<IErc1155MintDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.mintToken"
      data-testid="Erc1155MintDialog"
      {...rest}
    >
      <ContractInput name="contractId" related="address" />
      <TemplateInput name="templateId" />
      <TextInput name="amount" />
      <TextInput name="account" />
    </FormDialog>
  );
};
