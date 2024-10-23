import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Alert, Typography } from "@mui/material";

import { FormDialog } from "@ethberry/mui-dialog-form";
import { SelectInput, TextInput } from "@ethberry/mui-inputs-core";
import { RichTextEditor } from "@ethberry/mui-inputs-draft";
import { AvatarInput } from "@ethberry/mui-inputs-image-firebase";
import { ContractFeatures, ContractStatus, IContract } from "@framework/types";

import { BlockchainInfoPopover } from "../../../../../../components/popover/contract";
import { validationSchema } from "./validation";

export interface ILootContractEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
  initialValues: IContract;
}

export const LootContractEditDialog: FC<ILootContractEditDialogProps> = props => {
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
    parameters,
  } = initialValues;

  const fixedValues = {
    id,
    title,
    address,
    description,
    contractStatus,
    imageUrl,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="LootContractEditForm"
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
      {!parameters.vrfSubId ? (
        <Alert severity="warning">
          <Typography>
            <FormattedMessage id="alert.chainLinkSubId" />
          </Typography>
        </Alert>
      ) : null}
      {!parameters.isConsumer ? (
        <Alert severity="warning">
          <Typography>
            <FormattedMessage id="alert.chainLinkConsumer" />
          </Typography>
        </Alert>
      ) : null}
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <SelectInput name="contractStatus" options={ContractStatus} disabledOptions={[ContractStatus.NEW]} />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
