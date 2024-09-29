import { FC } from "react";

import { FormDialog } from "@ethberry/mui-dialog-form";
import { SelectInput, TextInput } from "@ethberry/mui-inputs-core";
import { AvatarInput } from "@ethberry/mui-inputs-image-firebase";
import { RichTextEditor } from "@ethberry/mui-inputs-draft";
import { EntityInput } from "@ethberry/mui-inputs-entity";
import { ContractStatus, IContract } from "@framework/types";

import { validationSchema } from "./validation";
import { BlockchainInfoPopover } from "../../../../../../components/dialogs/contract";

export interface IPonziContractEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
  initialValues: Partial<IContract>;
}

export const PonziContractEditDialog: FC<IPonziContractEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, merchantId, title, description, imageUrl, contractStatus, address, chainId, contractFeatures } =
    initialValues;

  const fixedValues = {
    id,
    merchantId,
    title,
    description,
    address,
    contractStatus,
    imageUrl,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="PonziContractEditForm"
      action={
        id ? <BlockchainInfoPopover address={address} chainId={chainId} contractFeatures={contractFeatures} /> : null
      }
      {...rest}
    >
      <EntityInput name="merchantId" controller="merchants" disableClear />
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <SelectInput name="contractStatus" options={ContractStatus} disabledOptions={[ContractStatus.NEW]} />
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
