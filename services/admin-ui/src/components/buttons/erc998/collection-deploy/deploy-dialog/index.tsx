import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";
import { Erc998TokenTemplate, IErc998CollectionDeployDto, IErc998Token } from "@framework/types";

import { validationSchema } from "./validation";

export interface IErc998CollectionDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc998Token>, form?: any) => Promise<void>;
}

export const Erc998CollectionDeployDialog: FC<IErc998CollectionDeployDialogProps> = props => {
  const fixedValues: IErc998CollectionDeployDto = {
    contractTemplate: Erc998TokenTemplate.SIMPLE,
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
      data-testid="Erc998CollectionDeployDialog"
      {...props}
    >
      <SelectInput name="contractTemplate" options={Erc998TokenTemplate} />
      <TextInput name="name" />
      <TextInput name="symbol" />
      <TextInput name="baseTokenURI" />
      <CurrencyInput name="royalty" symbol="%" />
    </FormDialog>
  );
};
