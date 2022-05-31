import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { Erc1155TokenTemplate, IErc1155Token, IErc1155CollectionDeployDto } from "@framework/types";

import { validationSchema } from "./validation";

export interface IErc1155TokenDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc1155Token>, form: any) => Promise<void>;
}

export const Erc1155TokenDeployDialog: FC<IErc1155TokenDeployDialogProps> = props => {
  const fixedValues: IErc1155CollectionDeployDto = {
    contractTemplate: Erc1155TokenTemplate.SIMPLE,
    baseTokenURI: process.env.BE_URL,
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
