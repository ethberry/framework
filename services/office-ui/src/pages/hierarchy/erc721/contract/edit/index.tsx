import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Alert } from "@mui/material";

import { FormDialog } from "@ethberry/mui-dialog-form";
import { SelectInput, TextInput } from "@ethberry/mui-inputs-core";
import { RichTextEditor } from "@ethberry/mui-inputs-draft";
import { AvatarInput } from "@ethberry/mui-inputs-image-firebase";
import { EntityInput } from "@ethberry/mui-inputs-entity";
import type { IContract } from "@framework/types";
import { ContractFeatures, ContractStatus } from "@framework/types";

import { BlockchainInfoPopover } from "../../../../../components/popover/contract";
import { validationSchema } from "./validation";

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
    symbol,
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
        id ? (
          <BlockchainInfoPopover
            name={name}
            symbol={symbol}
            address={address}
            baseTokenURI={baseTokenURI}
            chainId={chainId}
            contractFeatures={contractFeatures}
            {...(!contractFeatures.includes(ContractFeatures.SOULBOUND) && { royalty: `${royalty / 100}%` })}
          />
        ) : null
      }
      {...rest}
    >
      {!id ? (
        <Alert severity="warning">
          <FormattedMessage id="alert.risk" />
        </Alert>
      ) : null}
      <EntityInput name="merchantId" controller="merchants" />
      {!id ? <TextInput name="symbol" /> : null}
      <TextInput name="title" />
      <RichTextEditor name="description" />
      {!id ? <TextInput name="address" /> : null}
      {id ? (
        <SelectInput name="contractStatus" options={ContractStatus} disabledOptions={[ContractStatus.NEW]} />
      ) : null}
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
