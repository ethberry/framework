import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { EthInput } from "@gemunion/mui-inputs-mask";

import { validationSchema } from "./validation";

export interface IErc1155TransferDto {
  account: string;
  amount: string;
}

export interface IErc1155TransferDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IErc1155TransferDto, form: any) => Promise<void>;
  initialValues: IErc1155TransferDto;
  message: string;
  testId: string;
}

export const Erc1155TransferDialog: FC<IErc1155TransferDialogProps> = props => {
  const { initialValues, message, testId = "Erc1155TransferDialogForm", ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message={message}
      testId={testId}
      {...rest}
    >
      <EthInput name="amount" units={0} symbol="" />
      <TextInput name="account" />
    </FormDialog>
  );
};
