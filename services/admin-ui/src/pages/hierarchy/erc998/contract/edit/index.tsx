import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Alert, Typography } from "@mui/material";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import { BusinessType, ContractFeatures, ContractStatus, IContract } from "@framework/types";

import { BlockchainInfoPopover } from "../../../../../components/popover/contract";
import { UpgradeProductTypeDialog } from "../../../../../components/dialogs/product-type";
import { validationSchema } from "./validation";

export interface IErc998ContractEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
  initialValues: IContract;
}

export const Erc998ContractEditDialog: FC<IErc998ContractEditDialogProps> = props => {
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

  // to create token use office
  if (!id && process.env.BUSINESS_TYPE === BusinessType.B2B) {
    return <UpgradeProductTypeDialog open={rest.open} onClose={rest.onCancel} />;
  }

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="Erc998ContractEditForm"
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
      <TextInput name="title" />
      <RichTextEditor name="description" />
      {id ? (
        <SelectInput name="contractStatus" options={ContractStatus} disabledOptions={[ContractStatus.NEW]} />
      ) : null}
      <AvatarInput name="imageUrl" />
      {contractFeatures.includes(ContractFeatures.RANDOM) || contractFeatures.includes(ContractFeatures.GENES) ? (
        <Fragment>
          <Alert severity="warning">
            <Typography>
              <a id="anchor" href={"/chain-link"}>
                <FormattedMessage id="alert.randomChainlink" />
              </a>
            </Typography>
          </Alert>
        </Fragment>
      ) : null}
    </FormDialog>
  );
};
