import { FC } from "react";

import { TokenType } from "@framework/types";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { TokenTypeInput } from "@gemunion/mui-inputs-asset";

import { AmountInput } from "./amount-input";
import { ContractInput } from "./contract-input";
import { validationSchema } from "./validation";

export interface IStakingAllowanceDto {
  amount: string;
  contract: {
    contractId?: number;
    address: string;
    contractType: TokenType;
    tokenType: TokenType;
    decimals: number;
  };
}

export interface IStakingAllowanceDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IStakingAllowanceDto, form: any) => Promise<void>;
  initialValues: IStakingAllowanceDto;
}

export const StakingAllowanceDialog: FC<IStakingAllowanceDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.allowance"
      testId="StakingAllowanceForm"
      showDebug={true}
      {...rest}
    >
      <TokenTypeInput prefix="contract" disabledOptions={[TokenType.NATIVE]} />
      <ContractInput />
      <AmountInput />
    </FormDialog>
  );
};
