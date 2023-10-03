import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";

import { ContractStatus, IContract } from "@framework/types";

import { validationSchema } from "./validation";
import { BlockchainInfoPopover } from "../../../../../components/popover/contract";

export interface IPonziContractEditDialogProps {
  open: boolean;
  onCancel: (form?: any) => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
  initialValues: IContract;
}

export const PonziContractEditDialog: FC<IPonziContractEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, imageUrl, contractStatus, description, address, contractFeatures } = initialValues;

  const fixedValues = {
    id,
    title,
    address,
    imageUrl,
    description,
    contractStatus,
    contractFeatures,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="PonziContractEditForm"
      action={id ? <BlockchainInfoPopover address={address} contractFeatures={contractFeatures} /> : null}
      {...rest}
    >
      <TextInput name="title" />
      {/* <RichTextEditor name="description" /> */}
      <SelectInput name="contractStatus" options={ContractStatus} disabledOptions={[ContractStatus.NEW]} />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
