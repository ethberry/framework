import { FC, Fragment } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { BusinessType, ContractStatus, IContract } from "@framework/types";

import { validationSchema } from "./validation";
import { BlockchainInfoPopover } from "../../../../../../components/dialogs/contract";
import { UpgradeProductTypeDialog } from "../../../../../../components/dialogs/product-type";

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

  // there is no exception for merchantId=1, to create token use office
  if (process.env.BUSINESS_TYPE === BusinessType.B2B) {
    return <UpgradeProductTypeDialog open={rest.open} onClose={rest.onCancel} />;
  }

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
