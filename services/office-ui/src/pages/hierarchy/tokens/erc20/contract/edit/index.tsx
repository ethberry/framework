import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Alert } from "@mui/material";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import type { IContract } from "@framework/types";
import { ContractStatus } from "@framework/types";

import { BlockchainInfoPopover } from "../../../../../../components/popover/contract";
import { formatEther } from "../../../../../../utils/money";
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
    contractStatus,
    name,
    symbol,
    decimals,
    address,
    templates,
    chainId,
    merchantId,
    contractFeatures,
  } = initialValues;

  const [template] = templates;

  const fixedValues = {
    id,
    title,
    address,
    symbol,
    decimals,
    description,
    contractStatus,
    merchantId,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

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
            cap={formatEther(template.amount, decimals, "")}
            chainId={chainId}
            contractFeatures={contractFeatures}
          />
        ) : null
      }
      {...rest}
    >
      {!id ? (
        <Alert severity="warning">
          <FormattedMessage id="form.hints.risk" />
        </Alert>
      ) : null}
      <EntityInput name="merchantId" controller="merchants" />
      {!id ? <TextInput name="symbol" /> : null}
      <TextInput name="title" />
      <RichTextEditor name="description" />
      {!id ? <TextInput name="address" /> : null}
      {!id ? <NumberInput name="decimals" /> : null}
      {id ? (
        <SelectInput name="contractStatus" options={ContractStatus} disabledOptions={[ContractStatus.NEW]} />
      ) : null}
    </FormDialog>
  );
};
