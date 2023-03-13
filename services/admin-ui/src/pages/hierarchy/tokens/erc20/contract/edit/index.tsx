import { FC, Fragment } from "react";
import { FormattedMessage } from "react-intl";
import { Alert } from "@mui/material";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { ContractStatus, IContract } from "@framework/types";

import { createValidationSchema, editValidationSchema } from "./validation";
import { BlockchainInfoPopover } from "../../../../../../components/dialogs/contract";
import { formatEther } from "../../../../../../utils/money";

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
        ) : (
          <Fragment />
        )
      }
      {...rest}
    >
      {!id ? (
        <Alert severity="warning">
          <FormattedMessage id="form.hints.risk" />
        </Alert>
      ) : null}
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
