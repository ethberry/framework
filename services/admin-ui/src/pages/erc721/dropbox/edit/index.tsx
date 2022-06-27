import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { Erc721CollectionType, Erc721DropboxStatus, IErc721Dropbox } from "@framework/types";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";

import { validationSchema } from "./validation";
import { Erc20PriceInput } from "../../../../components/inputs/erc20-price";

export interface IErc721DropboxEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc721Dropbox>, form: any) => Promise<void>;
  initialValues: IErc721Dropbox;
}

export const Erc721DropboxEditDialog: FC<IErc721DropboxEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, price, imageUrl, dropboxStatus, erc721TemplateId, erc721CollectionId } =
    initialValues;

  const fixedValues = {
    id,
    title,
    description,
    price,
    imageUrl,
    dropboxStatus,
    erc721TemplateId,
    erc721CollectionId,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      data-testid="Erc721DropboxEditDialog"
      {...rest}
    >
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <Erc20PriceInput />
      {id ? <SelectInput name="dropboxStatus" options={Erc721DropboxStatus} /> : null}
      <EntityInput name="erc721TemplateId" controller="erc721-templates" />
      <EntityInput
        name="erc721CollectionId"
        controller="erc721-collections"
        data={{ collectionType: [Erc721CollectionType.DROPBOX] }}
      />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
