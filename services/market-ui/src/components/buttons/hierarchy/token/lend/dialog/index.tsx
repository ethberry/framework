import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { DateTimeInput } from "@gemunion/mui-inputs-picker";

import { validationSchema } from "./validation";

export interface ILendDto {
  account: string;
  expires: string;
}

export interface ILendDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: ILendDto, form: any) => Promise<void>;
  initialValues: ILendDto;
  message: string;
  testId: string;
}

export const LendDialog: FC<ILendDialogProps> = props => {
  const { initialValues, message, testId = "LendDialogForm", ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message={message}
      testId={testId}
      {...rest}
    >
      <TextInput name="account" />
      <DateTimeInput name="expires" />
      {/* <DateInput name="expires" /> */}
    </FormDialog>
  );
};
