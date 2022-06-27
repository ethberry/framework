import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";
import { Erc721TokenTemplate, IErc721CollectionDeployDto, IErc721Token } from "@framework/types";

import { validationSchema } from "./validation";

export interface IErc721CollectionDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc721Token>, form?: any) => Promise<void>;
}

export const Erc721CollectionDeployDialog: FC<IErc721CollectionDeployDialogProps> = props => {
  const fixedValues: IErc721CollectionDeployDto = {
    contractTemplate: Erc721TokenTemplate.SIMPLE,
    name: "",
    symbol: "",
    baseTokenURI: `${process.env.BE_URL}/metadata`,
    royalty: 0,
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      data-testid="Erc721CollectionDeployDialog"
      {...props}
    >
      <SelectInput name="contractTemplate" options={Erc721TokenTemplate} />
      <TextInput name="name" />
      <TextInput name="symbol" />
      <TextInput name="baseTokenURI" />
      <CurrencyInput name="royalty" symbol="%" />
    </FormDialog>
  );
};
