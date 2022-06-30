import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ContractRole, DropboxStatus, IDropbox } from "@framework/types";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";

import { validationSchema } from "./validation";
import { PriceInput } from "../../../../components/inputs/price";

export interface IDropboxEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IDropbox>, form: any) => Promise<void>;
  initialValues: IDropbox;
}

export const DropboxEditDialog: FC<IDropboxEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, price, imageUrl, dropboxStatus, templateId, contractId } = initialValues;

  const fixedValues = {
    id,
    title,
    description,
    price,
    imageUrl,
    dropboxStatus,
    templateId,
    contractId,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      data-testid="DropboxEditDialog"
      {...rest}
    >
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <PriceInput prefix="price" />
      {id ? <SelectInput name="dropboxStatus" options={DropboxStatus} /> : null}
      <EntityInput name="templateId" controller="templates" />
      <EntityInput name="contract" controller="contract" data={{ contractRole: [ContractRole.DROPBOX] }} />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
