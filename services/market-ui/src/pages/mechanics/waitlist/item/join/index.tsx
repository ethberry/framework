import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";

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

export const WaitlistJoinDialog: FC<IWaitlistClaimDialogProps> = props => {
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
      message="dialogs.join"
      testId="WaitlistJoinDialog"
      {...rest}
    >
      <TextInput name="account" readOnly />
      <EntityInput name="listId" controller="waitlist/list" />
    </FormDialog>
  );
};
