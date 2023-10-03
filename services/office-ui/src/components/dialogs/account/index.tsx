import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";

import { validationSchema } from "./validation";

export interface IAccountDto {
  account: string;
}

export interface IAccountDialogProps {
  open: boolean;
  onCancel: (form?: any) => void;
  onConfirm: (values: IAccountDto, form: any) => Promise<void>;
  initialValues: IAccountDto;
  message: string;
  testId: string;
}

export const AccountDialog: FC<IAccountDialogProps> = props => {
  const { initialValues, message, testId = "AccountDialogForm", ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message={message}
      testId={testId}
      {...rest}
    >
      <TextInput name="account" />
    </FormDialog>
  );
};
