import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { DateTimeInput } from "@gemunion/mui-inputs-picker";

import { validationSchema } from "./validation";

export interface IBorrowDto {
  account: string;
  expires: string;
}

export interface IBorrowDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IBorrowDto, form: any) => Promise<void>;
  initialValues: IBorrowDto;
  message: string;
  testId: string;
}

export const BorrowDialog: FC<IBorrowDialogProps> = props => {
  const { initialValues, message, testId = "BorrowDialogForm", ...rest } = props;

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
