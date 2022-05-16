import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";
import { Erc721TokenTemplate, IErc721Token, IErc721TokenDeployDto } from "@framework/types";

import { validationSchema } from "./validation";

export interface IErc721TokenDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc721Token>, formikBag: any) => Promise<void>;
}

export const Erc721TokenDeployDialog: FC<IErc721TokenDeployDialogProps> = props => {
  const fixedValues: IErc721TokenDeployDto = {
    contractTemplate: Erc721TokenTemplate.SIMPLE,
    name: "",
    symbol: "",
    baseTokenURI: "",
    royalty: 0,
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      data-testid="Erc721TokenDeployDialog"
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
