import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import { UniContractStatus, UniContractRole, IUniContract } from "@framework/types";

import { validationSchema } from "./validation";
import { BlockchainInfoPopover } from "../../../../components/popover";

export interface IErc721CollectionEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IUniContract>, form: any) => Promise<void>;
  initialValues: IUniContract;
}

export const Erc721CollectionEditDialog: FC<IErc721CollectionEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const {
    id,
    title,
    description,
    baseTokenURI,
    imageUrl,
    contractStatus,
    contractRole,
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
    contractRole,
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
      <SelectInput name="contractStatus" options={UniContractStatus} disabledOptions={[UniContractStatus.NEW]} />
      <SelectInput name="contractRole" options={UniContractRole} readOnly />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
