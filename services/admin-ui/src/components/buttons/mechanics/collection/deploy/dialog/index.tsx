import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";
import { CollectionContractTemplates, ICollectionContractDeployDto, IContract } from "@framework/types";

import { validationSchema } from "./validation";

export interface IErc721CollectionDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form?: any) => Promise<void>;
  initialValues: ICollectionContractDeployDto;
}

export const CollectionContractDeployDialog: FC<IErc721CollectionDeployDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      testId="CollectionContractDeployForm"
      {...rest}
    >
      <SelectInput name="contractTemplate" options={CollectionContractTemplates} />
      <TextInput name="name" />
      <TextInput name="symbol" />
      <TextInput name="baseTokenURI" />
      <CurrencyInput name="royalty" symbol="%" />
      <NumberInput name="batchSize" />
    </FormDialog>
  );
};
