import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { Erc1155ContractTemplate, IContract, IContractDeployDto } from "@framework/types";

import { validationSchema } from "./validation";

export interface IErc1155TokenDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
}

export const Erc1155TokenDeployDialog: FC<IErc1155TokenDeployDialogProps> = props => {
  const fixedValues: IContractDeployDto = {
    contractTemplate: Erc1155ContractTemplate.SIMPLE,
    baseTokenURI: `${process.env.BE_URL}/metadata`,
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      data-testid="Erc1155TokenDeployDialog"
      {...props}
    >
      <SelectInput name="contractTemplate" options={Erc1155ContractTemplate} />
      <TextInput name="baseTokenURI" />
    </FormDialog>
  );
};
