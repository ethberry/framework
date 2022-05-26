import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput, NumberInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import { Erc721CollectionStatus, Erc721CollectionType, IErc721Collection } from "@framework/types";

import { validationSchema } from "./validation";

export interface IErc721CollectionEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc721Collection>, formikBag: any) => Promise<void>;
  initialValues: IErc721Collection;
}

export const Erc721CollectionEditDialog: FC<IErc721CollectionEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const {
    id,
    title,
    description,
    baseTokenURI,
    imageUrl,
    collectionStatus,
    collectionType,
    address,
    symbol,
    name,
    royalty,
  } = initialValues;

  const fixedValues = {
    id,
    title,
    description,
    collectionStatus,
    collectionType,
    imageUrl,
    name,
    symbol,
    address,
    baseTokenURI,
    royalty,
  };

  const message = id ? "dialogs.edit" : "dialogs.add";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      {...rest}
      data-testid="Erc721CollectionEditDialog"
    >
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <TextInput name="name" readOnly />
      <TextInput name="symbol" readOnly />
      <TextInput name="address" readOnly />
      <TextInput name="baseTokenURI" readOnly />
      <NumberInput name="royalty" readOnly />
      <SelectInput
        name="collectionStatus"
        options={Erc721CollectionStatus}
        disabledOptions={[Erc721CollectionStatus.NEW]}
      />
      <SelectInput name="collectionType" options={Erc721CollectionType} readOnly />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
