import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { AvatarInput } from "@gemunion/mui-inputs-image-s3";
import { IErc1155Collection } from "@framework/types";

import { validationSchema } from "./validation";

export interface IEditErc1155CollectionDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc1155Collection>, formikBag: any) => Promise<void>;
  initialValues: IErc1155Collection;
}

export const Erc1155CollectionEditDialog: FC<IEditErc1155CollectionDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, imageUrl, address } = initialValues;
  const fixedValues = {
    id,
    title,
    description,
    imageUrl,
    address,
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
      <TextInput name="address" readOnly={!!id} />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
