import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { DropboxStatus, IDropbox, UniContractRole } from "@framework/types";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";

import { validationSchema } from "./validation";
import { PriceInput } from "../../../../components/inputs/price";

export interface IDropboxEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IDropbox>, form: any) => Promise<void>;
  initialValues: IDropbox;
}

export const Erc721DropboxEditDialog: FC<IDropboxEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, price, imageUrl, dropboxStatus, uniTemplateId, uniContractId } =
    initialValues;

  const fixedValues = {
    id,
    title,
    description,
    price,
    imageUrl,
    dropboxStatus,
    uniTemplateId,
    uniContractId,
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
      <EntityInput name="uniTemplateId" controller="uni-templates" />
      <EntityInput name="uniContract" controller="uni-contract" data={{ contractType: [UniContractRole.DROPBOX] }} />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
