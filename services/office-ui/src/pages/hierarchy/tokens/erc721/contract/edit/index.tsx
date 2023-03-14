import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ContractStatus, IContract } from "@framework/types";

import { validationSchema } from "./validation";
import { BlockchainInfoPopover } from "../../../../../../components/popover/contract";

export interface IErc721ContractEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
  initialValues: IContract;
}

export const Erc721ContractEditDialog: FC<IErc721ContractEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const {
    id,
    title,
    description,
    baseTokenURI,
    imageUrl,
    contractStatus,
    address,
    symbol,
    name,
    royalty,
    chainId,
    contractFeatures,
    merchantId,
  } = initialValues;

  const fixedValues = {
    id,
    title,
    address,
    description,
    contractStatus,
    imageUrl,
    merchantId,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="Erc721ContractEditForm"
      action={
        <BlockchainInfoPopover
          name={name}
          symbol={symbol}
          address={address}
          baseTokenURI={baseTokenURI}
          royalty={`%${royalty / 100}`}
          chainId={chainId}
          contractFeatures={contractFeatures}
        />
      }
      {...rest}
    >
      <EntityInput name="merchantId" controller="merchants" />
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <SelectInput name="contractStatus" options={ContractStatus} disabledOptions={[ContractStatus.NEW]} />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
