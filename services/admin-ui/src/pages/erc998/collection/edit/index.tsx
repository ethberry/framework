import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import { UniContractStatus, UniContractType, IErc998Collection } from "@framework/types";

import { validationSchema } from "./validation";
import { BlockchainInfoPopover } from "../../../../components/popover";

export interface IErc998CollectionEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc998Collection>, form: any) => Promise<void>;
  initialValues: IErc998Collection;
}

export const Erc998CollectionEditDialog: FC<IErc998CollectionEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const {
    id,
    title,
    description,
    baseTokenURI,
    imageUrl,
    contractStatus,
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
    contractStatus,
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
      data-testid="Erc998CollectionEditDialog"
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
        name="contractStatus"
        options={UniContractStatus}
        disabledOptions={[UniContractStatus.NEW]}
      />
      <SelectInput name="collectionType" options={UniContractType} readOnly />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
