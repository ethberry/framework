import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { EthInput } from "@gemunion/mui-inputs-mask";

import { validationSchema } from "./validation";
import { ContractInput } from "./contract-input";

export interface IMintErc20TokenDto {
  address: string;
  contractId: number;
  amount: string;
  account: string;
}

export interface IMintErc20TokenDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IMintErc20TokenDto, form: any) => Promise<void>;
  initialValues: IMintErc20TokenDto;
}

export const MintErc20TokenDialog: FC<IMintErc20TokenDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.mintToken"
      data-testid="Erc20MintDialog"
      {...rest}
    >
      <ContractInput name="contractId" related="address" />
      <EthInput name="amount" symbol="" />
      <TextInput name="account" />
    </FormDialog>
  );
};
