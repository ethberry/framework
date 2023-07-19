import { FC, Fragment } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { ContractStatus, IContract } from "@framework/types";

import { validationSchema } from "./validation";
import { BlockchainInfoPopover } from "../../../../../../components/dialogs/contract";

export interface INativeTokenEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
  initialValues: IContract;
}

export const NativeTokenEditDialog: FC<INativeTokenEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, contractStatus, symbol, decimals, chainId } = initialValues;

  const fixedValues = {
    id,
    title,
    description,
    contractStatus,
    symbol,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="NativeTokenEditDialog"
      action={id ? <BlockchainInfoPopover symbol={symbol} decimals={decimals} chainId={chainId} /> : <Fragment />}
      {...rest}
    >
      <TextInput name="symbol" />
      <TextInput name="title" />
      <RichTextEditor name="description" />
      {id ? (
        <SelectInput name="contractStatus" options={ContractStatus} disabledOptions={[ContractStatus.NEW]} />
      ) : null}
    </FormDialog>
  );
};
