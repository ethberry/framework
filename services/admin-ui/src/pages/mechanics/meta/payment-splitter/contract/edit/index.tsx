import { FC } from "react";

import { FormDialog } from "@ethberry/mui-dialog-form";
import { SelectInput, TextInput } from "@ethberry/mui-inputs-core";
import { ContractStatus, IContract } from "@framework/types";

import { validationSchema } from "./validation";
import { BlockchainInfoPopover } from "../../../../../../components/popover/contract";

export interface IPaymentSplitterEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
  initialValues: IContract;
}

export const PaymentSplitterEditDialog: FC<IPaymentSplitterEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, contractStatus, address, chainId, contractFeatures } = initialValues;
  const fixedValues = {
    id,
    title,
    contractStatus,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="PaymentSplitterEditForm"
      action={
        id ? (
          <BlockchainInfoPopover name={title} address={address} chainId={chainId} contractFeatures={contractFeatures} />
        ) : null
      }
      {...rest}
    >
      <TextInput name="title" />
      <SelectInput name="contractStatus" options={ContractStatus} disabledOptions={[ContractStatus.NEW]} />
    </FormDialog>
  );
};
