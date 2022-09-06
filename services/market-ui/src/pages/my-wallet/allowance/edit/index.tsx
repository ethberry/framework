import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { IAsset, TokenType } from "@framework/types";

import { validationSchema } from "./validation";
import { ContractInput } from "./contract-input";
import { ContractCustomInput } from "./contract-custom-input";
import { TokenTypeInput } from "./token-type-input";
import { AmountInput } from "./amount-input";

export interface IAllowanceDto {
  allowance: IAsset;
  tokenType: TokenType;
  contractId: number;
  address: string;
  decimals: number;
  amount: string;
  addressCustom: string;
}

export interface IAllowanceDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IAllowanceDto, form: any) => Promise<void>;
  initialValues: IAllowanceDto;
}

export const AllowanceDialog: FC<IAllowanceDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.allowance"
      testId="AllowanceForm"
      {...rest}
    >
      <TokenTypeInput />
      <ContractInput />
      <AmountInput />
      <ContractCustomInput />
    </FormDialog>
  );
};
