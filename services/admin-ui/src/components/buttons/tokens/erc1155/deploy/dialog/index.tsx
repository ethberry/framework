import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { Erc1155ContractTemplates, IContract, IErc1155ContractDeployDto } from "@framework/types";

import { RoyaltyInput } from "../../../../../inputs/royalty";
import { validationSchema } from "./validation";

export interface IErc1155TokenDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
  initialValues: IErc1155ContractDeployDto;
}

export const Erc1155ContractDeployDialog: FC<IErc1155TokenDeployDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      testId="Erc1155ContractDeployForm"
      disabled={false}
      {...rest}
    >
      <SelectInput name="contractTemplate" options={Erc1155ContractTemplates} />
      <TextInput name="baseTokenURI" />
      <RoyaltyInput />
    </FormDialog>
  );
};
