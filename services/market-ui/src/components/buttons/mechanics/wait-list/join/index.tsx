import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";

import { validationSchema } from "./validation";

export interface IWaitListClaimDto {
  account: string;
  listId: number;
}

export interface IWaitListClaimDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IWaitListClaimDto>, form: any) => Promise<void>;
  initialValues: IWaitListClaimDto;
}

export const WaitListJoinDialog: FC<IWaitListClaimDialogProps> = props => {
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
      testId="WaitListJoinDialog"
      {...rest}
    >
      <TextInput name="account" readOnly />
      <EntityInput name="listId" controller="wait-list/list" />
    </FormDialog>
  );
};
