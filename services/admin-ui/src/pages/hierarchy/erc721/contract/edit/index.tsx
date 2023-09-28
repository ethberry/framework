import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Alert } from "@mui/material";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import type { IContract } from "@framework/types";
import { BusinessType, ContractFeatures, ContractStatus } from "@framework/types";

import { BlockchainInfoPopover } from "../../../../../components/popover/contract";
import { UpgradeProductTypeDialog } from "../../../../../components/dialogs/product-type";
import { validationSchema } from "./validation";
import { ChainLinkSetSubscriptionButton } from "../../../../../components/buttons/integrations/chain-link/set-subscription";
import { ChainLinkAddConsumerButton } from "../../../../../components/buttons/integrations/chain-link/add-subscription";

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
    parameters,
  } = initialValues;

  const fixedValues = {
    id,
    title,
    address,
    symbol,
    description,
    contractStatus,
    imageUrl,
    contractFeatures,
    parameters,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";
  // there is no exception for merchantId=1, to create token use office
  if (!id && process.env.BUSINESS_TYPE === BusinessType.B2B) {
    return <UpgradeProductTypeDialog open={rest.open} onClose={rest.onCancel} />;
  }

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
            royalty={`${royalty / 100}%`}
            chainId={chainId}
            contractFeatures={contractFeatures}
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
      {!id ? <TextInput name="symbol" /> : null}
      <TextInput name="title" />
      <RichTextEditor name="description" />
      {!id ? <TextInput name="address" /> : null}
      {id ? (
        <SelectInput
          name="contractStatus"
          options={ContractStatus}
          disabledOptions={
            (contractFeatures.includes(ContractFeatures.RANDOM) || contractFeatures.includes(ContractFeatures.GENES)) &&
            (!parameters.vrfSubId || !parameters.isConsumer || parameters.vrfSubId === "0")
              ? [ContractStatus.NEW, ContractStatus.ACTIVE]
              : [ContractStatus.NEW]
          }
        />
      ) : null}
      <AvatarInput name="imageUrl" />
      {(parameters.vrfSubId === "0" || !parameters.vrfSubId) &&
      (contractFeatures.includes(ContractFeatures.RANDOM) || contractFeatures.includes(ContractFeatures.GENES)) ? (
        <Fragment>
          <Alert severity="warning">
            <FormattedMessage id="alert.vrfSub" />
          </Alert>
          <ChainLinkSetSubscriptionButton address={address} />
        </Fragment>
      ) : null}
      {!parameters.isConsumer &&
      (contractFeatures.includes(ContractFeatures.RANDOM) || contractFeatures.includes(ContractFeatures.GENES)) ? (
        <Fragment>
          <Alert severity="warning">
            <FormattedMessage id="alert.vrfConsumer" />
          </Alert>
          <ChainLinkAddConsumerButton contractId={id} subscriptionId={0} />
        </Fragment>
      ) : null}
    </FormDialog>
  );
};
