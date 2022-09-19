import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput, TextInput } from "@gemunion/mui-inputs-core";

import { validationSchema } from "./validation";

export interface IWaitlistClaimDto {
  account: string;
  listId: number;
}

export interface IWaitlistClaimDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IWaitlistClaimDto>, form: any) => Promise<void>;
  initialValues: IWaitlistClaimDto;
}

export const WaitlistClaimDialog: FC<IWaitlistClaimDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { account, listId } = initialValues;
  const fixedValues = {
    account,
    listId,
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.claim"
      testId="WaitlistClaimDialog"
      {...rest}
    >
      <TextInput name="account" />
      <NumberInput name="listId" />
    </FormDialog>
  );
};
