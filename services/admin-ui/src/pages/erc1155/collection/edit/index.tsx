import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import { Erc1155CollectionStatus, IErc1155Collection } from "@framework/types";

import { validationSchema } from "./validation";

export interface IErc1155CollectionEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc1155Collection>, formikBag: any) => Promise<void>;
  initialValues: IErc1155Collection;
}

export const Erc1155CollectionEditDialog: FC<IErc1155CollectionEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, baseTokenURI, imageUrl, address, collectionStatus } = initialValues;
  const fixedValues = {
    id,
    title,
    description,
    baseTokenURI,
    imageUrl,
    address,
    collectionStatus,
  };

  const message = id ? "dialogs.edit" : "dialogs.add";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      data-testid="Erc1155CollectionEditDialog"
      {...rest}
    >
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <TextInput name="address" readOnly />
      <TextInput name="baseTokenURI" readOnly />
      <SelectInput
        name="collectionStatus"
        options={Erc1155CollectionStatus}
        disabledOptions={[Erc1155CollectionStatus.NEW]}
      />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
