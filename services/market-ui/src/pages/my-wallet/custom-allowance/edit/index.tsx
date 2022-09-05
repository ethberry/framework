import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TokenType } from "@framework/types";

import { validationSchema } from "./validation";
import { ContractInput } from "./contract-input";
import { ContractCustomInput } from "./contract-custom-input";
import { TokenTypeInput } from "./token-type-input";
import { AmountInput } from "./amount-input";

export interface IAllowanceCustomDto {
  tokenType: TokenType;
  contractId: number;
  address: string;
  decimals: string;
  amount: string;
  addressCustom: string;
}

export interface IAllowanceCustomDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IAllowanceCustomDto, form: any) => Promise<void>;
}

export const AllowanceCustomDialog: FC<IAllowanceCustomDialogProps> = props => {
  const initialValues = {
    tokenType: TokenType.ERC20,
    decimals: 18,
    amount: 0,
  };

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.allowance"
      testId="AllowanceCustomForm"
      {...props}
    >
      <TokenTypeInput />
      <ContractInput />
      <ContractCustomInput />
      <AmountInput />
    </FormDialog>
  );
};
