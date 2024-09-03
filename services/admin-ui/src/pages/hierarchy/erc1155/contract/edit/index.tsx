import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Alert } from "@mui/material";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import { BusinessType, ContractFeatures, ContractStatus, IContract } from "@framework/types";

import { BlockchainInfoPopover } from "../../../../../components/popover/contract";
import { UpgradeProductTypeDialog } from "../../../../../components/dialogs/product-type";
import { validationSchema } from "./validation";

export interface IErc1155ContractEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
  initialValues: IContract;
}

export const Erc1155ContractEditDialog: FC<IErc1155ContractEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const {
    id,
    title,
    description,
    imageUrl,
    address,
    contractStatus,
    baseTokenURI,
    royalty,
    chainId,
    contractFeatures,
  } = initialValues;

  const fixedValues = {
    id,
    title,
    description,
    address,
    imageUrl,
    contractStatus,
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
      testId="Erc1155ContractEditForm"
      action={
        id ? (
          <BlockchainInfoPopover
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
      <TextInput name="title" required />
      <RichTextEditor name="description" InputLabelProps={{ required: true }} />
      {!id ? <TextInput name="address" /> : null}
      {id ? (
        <SelectInput name="contractStatus" options={ContractStatus} disabledOptions={[ContractStatus.NEW]} />
      ) : null}
      <AvatarInput name="imageUrl" required />
    </FormDialog>
  );
};
