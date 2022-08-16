import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";
import { Erc1155ContractFeatures, IContract, IErc1155ContractDeployDto } from "@framework/types";

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
      {...rest}
    >
      <SelectInput name="contractFeatures" options={Erc1155ContractFeatures} multiple />
      <TextInput name="baseTokenURI" />
      <CurrencyInput name="royalty" symbol="%" />
    </FormDialog>
  );
};
