import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { EthInput } from "@gemunion/mui-inputs-mask";

import { validationSchema } from "./validation";

export interface IAmountDto {
  amount: number;
}

export interface IAmountDialogProps {
  open: boolean;
  onCancel: (form?: any) => void;
  onConfirm: (values: IAmountDto, form: any) => Promise<void>;
  initialValues: IAmountDto;
}

export const AmountDialog: FC<IAmountDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      disabled={false}
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.amount"
      testId="AmountForm"
      {...rest}
    >
      <EthInput name="amount" units={0} symbol="" />
    </FormDialog>
  );
};
