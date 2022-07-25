import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { EthInput } from "@gemunion/mui-inputs-mask";

import { validationSchema } from "./validation";
import { ContractInput } from "./contract-input";

export interface IErc20AllowanceDto {
  address: string;
  amount: string;
}

export interface IErc20AllowanceDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IErc20AllowanceDto, form: any) => Promise<void>;
}

export const Erc20AllowanceDialog: FC<IErc20AllowanceDialogProps> = props => {
  const initialValues = {};

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.allowance"
      data-testid="Erc20AllowanceDialog"
      {...props}
    >
      <ContractInput name="contractId" related="address" />
      <EthInput name="amount" symbol="" />
    </FormDialog>
  );
};
