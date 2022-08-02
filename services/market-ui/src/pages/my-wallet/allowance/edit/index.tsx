import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TokenType } from "@framework/types";

import { validationSchema } from "./validation";
import { ContractInput } from "./contract-input";
import { TokenTypeInput } from "./token-type-input";
import { AmountInput } from "./amount-input";

export interface IAllowanceDto {
  tokenType: TokenType;
  contractId: number;
  address: string;
  decimals: string;
  amount: string;
}

export interface IAllowanceDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IAllowanceDto, form: any) => Promise<void>;
}

export const AllowanceDialog: FC<IAllowanceDialogProps> = props => {
  const initialValues = {
    tokenType: TokenType.ERC20,
    decimals: 18,
    amount: 0,
  };

  const testIdPrefix = "AllowanceForm";

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.allowance"
      data-testid={testIdPrefix}
      {...props}
    >
      <TokenTypeInput />
      <ContractInput />
      <AmountInput />
    </FormDialog>
  );
};
