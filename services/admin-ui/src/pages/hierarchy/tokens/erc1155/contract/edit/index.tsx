import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Alert } from "@mui/material";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import { BusinessType, ContractStatus, IContract } from "@framework/types";

import { BlockchainInfoPopover } from "../../../../../../components/dialogs/contract";
import { validationSchema } from "./validation";
import { UpgradeProductTypeDialog } from "../../../../../../components/dialogs/product-type";

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
    imageUrl,
    contractStatus,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  // there is no exception for merchantId=1, to create token use office
  if (process.env.BUSINESS_TYPE === BusinessType.B2B) {
    return <UpgradeProductTypeDialog open={rest.open} onClose={rest.onCancel} />;
  }

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="Erc1155ContractEditForm"
      action={
        <BlockchainInfoPopover
          address={address}
          baseTokenURI={baseTokenURI}
          royalty={`${royalty / 100}%`}
          chainId={chainId}
          contractFeatures={contractFeatures}
        />
      }
      {...rest}
    >
      {!id ? (
        <Alert severity="warning">
          <FormattedMessage id="form.hints.risk" />
        </Alert>
      ) : null}
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
