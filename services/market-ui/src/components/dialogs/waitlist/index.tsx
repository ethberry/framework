import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput, TextInput } from "@gemunion/mui-inputs-core";

import { validationSchema } from "./validation";

export interface IWaitListDto {
  account: string;
  listId: number;
}

export interface IWaitListDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IWaitListDto, form: any) => Promise<void>;
  initialValues: IWaitListDto;
  message: string;
  testId: string;
}

export const WaitListDialog: FC<IWaitListDialogProps> = props => {
  const { initialValues, message, testId = "WaitListDialogForm", ...rest } = props;

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
