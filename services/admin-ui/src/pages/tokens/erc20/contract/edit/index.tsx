import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { ContractStatus, IContract } from "@framework/types";

import { validationSchema } from "./validation";
import { BlockchainInfoPopover } from "../../../../../components/popover";
import { formatEther } from "../../../../../utils/money";

export interface IErc20TokenEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
  initialValues: IContract;
}

export const Erc20TokenEditDialog: FC<IErc20TokenEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, contractStatus, name, symbol, decimals, address, templates } = initialValues;

  const [template] = templates;

  const fixedValues = {
    id,
    title,
    address,
    description,
    contractStatus,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <>
      <FormDialog
        initialValues={fixedValues}
        validationSchema={validationSchema}
        message={message}
        testId="Erc20TokenEditDialog"
        headActions={(
          <BlockchainInfoPopover
            name={name}
            symbol={symbol}
            address={address}
            decimals={decimals}
            cap={formatEther(template.amount, decimals, "")}
          />
        )}
        {...rest}
      >
        <TextInput name="title" />
        <RichTextEditor name="description" />
        <SelectInput name="contractStatus" options={ContractStatus} disabledOptions={[ContractStatus.NEW]} />
        <TextInput name="address" disabled={true} />
      </FormDialog>
    </>
  );
};
