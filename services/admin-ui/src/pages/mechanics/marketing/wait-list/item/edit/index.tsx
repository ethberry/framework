import { FC } from "react";

import { FormDialog } from "@ethberry/mui-dialog-form";
import { TextInput } from "@ethberry/mui-inputs-core";
import { EntityInput } from "@ethberry/mui-inputs-entity";
import { ContractStatus, IWaitListItem } from "@framework/types";

import { validationSchema } from "./validation";

export interface IWaitListDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IWaitListItem, form: any) => Promise<void>;
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
