import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";

import { validationSchema } from "./validation";
import { WaitListItem } from "./wait-list-item";
import { WaitListListInput } from "./wait-list-list-input";
import { IWaitListItem } from "@framework/types";

export interface IWaitListClaimDto {
  account: string;
  listId: number;
}

export interface IWaitListJoinDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IWaitListItem>, form: any) => Promise<void>;
  initialValues: IWaitListItem;
}

export const WaitListJoinDialog: FC<IWaitListJoinDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { account, listId } = initialValues;
  const fixedValues = {
    account,
    listId,
  };

  return (
    <FormDialog
      disabled={false}
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.join"
      testId="WaitListJoinDialog"
      {...rest}
    >
      <WaitListItem />
      <TextInput name="account" readOnly />
      <WaitListListInput name="listId" />
    </FormDialog>
  );
};
