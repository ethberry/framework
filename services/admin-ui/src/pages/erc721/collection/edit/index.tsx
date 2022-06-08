import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import { Erc721CollectionStatus, Erc721CollectionType, IErc721Collection } from "@framework/types";

import { validationSchema } from "./validation";
import { BlockchainInfoPopover } from "../../../../components/popover";

export interface IErc721CollectionEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc721Collection>, form: any) => Promise<void>;
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
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      {...rest}
      data-testid="Erc721CollectionEditDialog"
    >
      <BlockchainInfoPopover
        name={name}
        symbol={symbol}
        address={address}
        baseTokenURI={baseTokenURI}
        royalty={royalty}
      />
      <TextInput name="title" />
      <RichTextEditor name="description" />
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
