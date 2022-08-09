import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";
import { ContractFeatures, Erc721ContractFeatures, IContract, IErc721ContractDeployDto } from "@framework/types";

import { validationSchema } from "./validation";

export interface IErc721CotractDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form?: any) => Promise<void>;
}

export const Erc721ContractDeployDialog: FC<IErc721CotractDeployDialogProps> = props => {
  const fixedValues: IErc721ContractDeployDto = {
    contractFeatures: [],
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
      testId="Erc721ContractDeployForm"
      {...props}
    >
      <SelectInput
        name="contractFeatures"
        options={Erc721ContractFeatures}
        // MODULE:MYSTERYBOX
        disabledOptions={[ContractFeatures.MYSTERYBOX]}
        multiple
      />
      <TextInput name="name" />
      <TextInput name="symbol" />
      <TextInput name="baseTokenURI" />
      <CurrencyInput name="royalty" symbol="%" />
    </FormDialog>
  );
};
