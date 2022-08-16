import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";
import { Erc998ContractFeatures, IErc998ContractDeployDto, IToken } from "@framework/types";

import { validationSchema } from "./validation";

export interface IErc998CollectionDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IToken>, form?: any) => Promise<void>;
  initialValues: IErc998ContractDeployDto;
}

export const Erc998ContractDeployDialog: FC<IErc998CollectionDeployDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      testId="Erc998ContractDeployForm"
      {...rest}
    >
      <SelectInput name="contractFeatures" options={Erc998ContractFeatures} multiple />
      <TextInput name="name" />
      <TextInput name="symbol" />
      <TextInput name="baseTokenURI" />
      <CurrencyInput name="royalty" symbol="%" />
    </FormDialog>
  );
};
