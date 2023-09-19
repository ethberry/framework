import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { EthInput } from "@gemunion/mui-inputs-mask";
import { IBalance } from "@framework/types";

import { emptyContract, emptyTemplate, emptyToken } from "../../../../../common/interfaces";
import { validationSchema } from "./validation";

export interface IAmountDialogDto {
  balance: IBalance;
  amount: string;
}

export interface IAmountDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IAmountDialogDto, form: any) => Promise<void>;
  initialValues: IAmountDialogDto;
  message: string;
  testId: string;
}

export const AmountDialog: FC<IAmountDialogProps> = props => {
  const { initialValues, message, testId = "AmountDialogForm", ...rest } = props;
  const { balance } = initialValues;

  const { token: { template: { contract: { decimals, symbol } = emptyContract } = emptyTemplate } = emptyToken } =
    balance;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message={message}
      testId={testId}
      {...rest}
    >
      <EthInput name="amount" units={decimals} symbol={`${symbol} `} />
    </FormDialog>
  );
};
