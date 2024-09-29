import { FC } from "react";

import { FormDialog } from "@ethberry/mui-dialog-form";
import { NumberInput, SelectInput, TextInput } from "@ethberry/mui-inputs-core";
import { CurrencyInput } from "@ethberry/mui-inputs-mask";
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
