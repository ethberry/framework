import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { EthInput } from "@gemunion/mui-inputs-mask";

import { validationSchema } from "./validation";

export interface ITransferDto {
  account: string;
  amount: string;
  decimals: number;
}

export interface ITransferDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: ITransferDto, form: any) => Promise<void>;
  initialValues: ITransferDto;
  message: string;
  testId: string;
}

export const TransferDialog: FC<ITransferDialogProps> = props => {
  const { initialValues, message, testId = "TransferDialogForm", ...rest } = props;
  const { decimals } = initialValues;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message={message}
      testId={testId}
      {...rest}
    >
      <TextInput name="account" />
      <EthInput name="amount" units={decimals} symbol="" />
    </FormDialog>
  );
};
