import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput, NumberInput } from "@gemunion/mui-inputs-core";

import { validationSchema } from "./validation";

export interface IWaitlistDto {
  account: string;
  listId: number;
}

export interface IWaitlistDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IWaitlistDto, form: any) => Promise<void>;
  initialValues: IWaitlistDto;
  message: string;
  testId: string;
}

export const WaitlistDialog: FC<IWaitlistDialogProps> = props => {
  const { initialValues, message, testId = "WaitlistDialogForm", ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message={message}
      testId={testId}
      {...rest}
    >
      <TextInput name="account" />
      <NumberInput name="listId" />
    </FormDialog>
  );
};
