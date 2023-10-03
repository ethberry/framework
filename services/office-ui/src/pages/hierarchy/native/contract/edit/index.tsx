import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { ContractStatus, IContract } from "@framework/types";

import { validationSchema } from "./validation";
import { BlockchainInfoPopover } from "../../../../../components/popover/contract";

export interface INativeTokenEditDialogProps {
  open: boolean;
  onCancel: (form?: any) => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
  initialValues: IContract;
}

export const NativeTokenEditDialog: FC<INativeTokenEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, contractStatus, symbol, decimals, chainId, merchantId } = initialValues;

  const fixedValues = {
    id,
    title,
    description,
    contractStatus,
    symbol,
    merchantId,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="NativeTokenEditDialog"
      action={id ? <BlockchainInfoPopover symbol={symbol} decimals={decimals} chainId={chainId} /> : null}
      {...rest}
    >
      <EntityInput name="merchantId" controller="merchants" />
      <TextInput name="symbol" />
      <TextInput name="title" />
      <RichTextEditor name="description" />
      {id ? (
        <SelectInput name="contractStatus" options={ContractStatus} disabledOptions={[ContractStatus.NEW]} />
      ) : null}
    </FormDialog>
  );
};
