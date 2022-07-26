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

  const testIdPrefix = "Erc1155MintForm";

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.mintToken"
      data-testid={testIdPrefix}
      {...rest}
    >
      <ContractInput name="contractId" related="address" data-testid={`${testIdPrefix}-contractId`} />
      <EthInput name="amount" symbol="" data-testid={`${testIdPrefix}-amount`} />
      <TextInput name="account" data-testid={`${testIdPrefix}-account`} />
    </FormDialog>
  );
};
