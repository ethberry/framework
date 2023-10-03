import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";

import { validationSchema } from "./validation";
import { ContractStatus, IWaitListItem } from "@framework/types";

export interface IWaitListDialogProps {
  open: boolean;
  onCancel: (form?: any) => void;
  onConfirm: (values: Partial<IWaitListItem>, form: any) => Promise<void>;
  initialValues: Partial<IWaitListItem>;
  testId: string;
}

export const WaitListItemEditDialog: FC<IWaitListDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, listId, account } = initialValues;
  const fixedValues = {
    id,
    listId,
    account,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog initialValues={fixedValues} message={message} validationSchema={validationSchema} {...rest}>
      <TextInput name="account" />
      <EntityInput
        name="listId"
        controller="wait-list/list"
        data={{
          contractStatus: [ContractStatus.ACTIVE],
          isRewardSet: false,
        }}
      />
    </FormDialog>
  );
};
