import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { Erc998CollectionType, Erc998DropboxStatus, IErc998Dropbox } from "@framework/types";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";

import { validationSchema } from "./validation";
import { Erc20PriceInput } from "../../../../components/inputs/erc20-price";

export interface IErc998DropboxEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc998Dropbox>, form: any) => Promise<void>;
  initialValues: IErc998Dropbox;
}

export const Erc998DropboxEditDialog: FC<IErc998DropboxEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, price, imageUrl, dropboxStatus, erc998TemplateId, erc998CollectionId } =
    initialValues;

  const fixedValues = {
    id,
    title,
    description,
    price,
    imageUrl,
    dropboxStatus,
    erc998TemplateId,
    erc998CollectionId,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      data-testid="Erc998DropboxEditDialog"
      {...rest}
    >
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <Erc20PriceInput />
      {id ? <SelectInput name="dropboxStatus" options={Erc998DropboxStatus} /> : null}
      <EntityInput name="erc998TemplateId" controller="erc998-templates" />
      <EntityInput
        name="erc998CollectionId"
        controller="erc998-collections"
        data={{ collectionType: [Erc998CollectionType.DROPBOX] }}
      />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
