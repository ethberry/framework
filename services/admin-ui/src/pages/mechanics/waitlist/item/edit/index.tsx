import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";

import { validationSchema } from "./validation";

export interface IWaitlistItemCreateDto {
  id: number;
  account: string;
  listId: number;
}

export interface IWaitlistDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IWaitlistItemCreateDto, form: any) => Promise<void>;
  initialValues: IWaitlistItemCreateDto;
  testId: string;
}

export const WaitlistItemEditDialog: FC<IWaitlistDialogProps> = props => {
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
