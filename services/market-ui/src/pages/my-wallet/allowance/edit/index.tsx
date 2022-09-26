import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { ContractFeatures, IAsset, TokenType } from "@framework/types";

import { validationSchema } from "./validation";
import { ContractInput } from "../../../../components/inputs/contract";
import { TokenTypeInput } from "./token-type-input";
import { AmountInput } from "./amount-input";

export interface IAllowanceDto {
  allowance: IAsset;
  tokenType: TokenType;
  contractId: number;
  contract: { main: string; custom: string };
  decimals: number;
  amount: string;
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
      <ContractInput name="contractId" related="main" />
      <AmountInput />
      <ContractInput
        name="customContractId"
        related="custom"
        data={{ contractFeatures: [ContractFeatures.ALLOWANCE], contractType: [] }}
      />
    </FormDialog>
  );
};
