import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";

import { validationSchema } from "./validation";

export interface IWaitListItemCreateDto {
  id: number;
  account: string;
  listId: number;
}

export interface IWaitListDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IWaitListItemCreateDto, form: any) => Promise<void>;
  initialValues: IWaitListItemCreateDto;
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
      <EntityInput name="listId" controller="waitlist/list" />
    </FormDialog>
  );
};
