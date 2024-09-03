import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Alert } from "@mui/material";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import { formatEther } from "@framework/exchange";
import type { IContract } from "@framework/types";
import { BusinessType, ContractStatus } from "@framework/types";

import { BlockchainInfoPopover } from "../../../../../components/popover/contract";
import { UpgradeProductTypeDialog } from "../../../../../components/dialogs/product-type";
import { createValidationSchema, editValidationSchema } from "./validation";

export interface IErc20TokenEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
  initialValues: IContract;
}

export const Erc20ContractEditDialog: FC<IErc20TokenEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const {
    id,
    title,
    description,
    imageUrl,
    contractStatus,
    name,
    symbol,
    decimals,
    address,
    templates,
    chainId,
    contractFeatures,
  } = initialValues;

  const [template] = templates;

  const fixedValues = {
    id,
    title,
    imageUrl,
    address,
    symbol,
    decimals,
    description,
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
      validationSchema={id ? editValidationSchema : createValidationSchema}
      message={message}
      testId="Erc20ContractCreateForm"
      action={
        id ? (
          <BlockchainInfoPopover
            name={name}
            symbol={symbol}
            address={address}
            decimals={decimals}
            cap={formatEther(template.cap, decimals, "")}
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
      <TextInput name="title" required />
      <RichTextEditor name="description" required />
      {!id ? <TextInput name="symbol" required /> : null}
      {!id ? <TextInput name="address" required /> : null}
      {!id ? <NumberInput name="decimals" required /> : null}
      {id ? (
        <SelectInput name="contractStatus" options={ContractStatus} disabledOptions={[ContractStatus.NEW]} required />
      ) : null}
      <AvatarInput name="imageUrl" required />
    </FormDialog>
  );
};
