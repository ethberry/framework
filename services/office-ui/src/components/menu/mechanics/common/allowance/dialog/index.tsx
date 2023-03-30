import { FC } from "react";

import { TokenType } from "@framework/types";
import { FormDialog } from "@gemunion/mui-dialog-form";

import { AmountInput } from "./amount-input";
import { ContractInput } from "./contract-input";
import { validationSchema } from "./validation";

export interface IAllowanceDto {
  amount: string;
  contract: {
    address: string;
    contractType: TokenType;
    decimals: number;
  };
  contractId: number;
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
      testId="MechanicsAllowanceForm"
      showDebug={true}
      {...rest}
    >
      <ContractInput />
      <AmountInput />
    </FormDialog>
  );
};
