import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { IErc1155Token } from "@framework/types";

import { validationSchema } from "./validation";

export enum Erc1155TokenTemplate {
  "SIMPLE" = "SIMPLE", // ACBS
}

export interface IErc1155ContractFields {
  contractTemplate: Erc1155TokenTemplate;
  baseTokenURI: string;
}

export interface IErc1155TokenDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc1155Token>, formikBag: any) => Promise<void>;
}

export const Erc1155TokenDeployDialog: FC<IErc1155TokenDeployDialogProps> = props => {
  const fixedValues: IErc1155ContractFields = {
    contractTemplate: Erc1155TokenTemplate.SIMPLE,
    baseTokenURI: "",
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      data-testid="Erc1155TokenDeployDialog"
      {...props}
    >
      <SelectInput name="contractTemplate" options={Erc1155TokenTemplate} />
      <TextInput name="baseTokenURI" />
    </FormDialog>
  );
};
