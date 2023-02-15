import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";
import { Erc721CollectionTemplates, IContract, IErc721CollectionDeployDto } from "@framework/types";

import { validationSchema } from "./validation";

export interface IErc721CollectionDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form?: any) => Promise<void>;
  initialValues: IErc721CollectionDeployDto;
}

export const Erc721CollectionDeployDialog: FC<IErc721CollectionDeployDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      testId="Erc721CollectionDeployForm"
      {...rest}
    >
      <SelectInput name="contractTemplate" options={Erc721CollectionTemplates} />
      <TextInput name="name" />
      <TextInput name="symbol" />
      <TextInput name="baseTokenURI" />
      <CurrencyInput name="royalty" symbol="%" />
      <NumberInput name="batchSize" />
    </FormDialog>
  );
};
