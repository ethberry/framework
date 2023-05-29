import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { EthInput } from "@gemunion/mui-inputs-mask";

import { validationSchema } from "./validation";

export interface IComposeTokenDto {
  amount: string;
  decimals: number;
}

export interface IComposeTokenDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IComposeTokenDto, form: any) => Promise<void>;
  initialValues: IComposeTokenDto;
}

export const ComposeTokenDialog: FC<IComposeTokenDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.fund"
      testId="ComposeTokenForm"
      {...rest}
    >
      <EthInput name="amount" units={18} symbol="" />
    </FormDialog>
  );
};
