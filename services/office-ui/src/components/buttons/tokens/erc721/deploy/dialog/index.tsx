import { FC } from "react";
import { useWeb3React } from "@web3-react/core";

import { FormDialog } from "@ethberry/mui-dialog-form";
import { SelectInput, TextInput } from "@ethberry/mui-inputs-core";
import { Erc721ContractTemplates, IContract, IErc721ContractDeployDto } from "@framework/types";

import { RoyaltyInput } from "../../../../../inputs/royalty";
import { validationSchema } from "./validation";
import { isTemplateDisabled } from "./utils";

export interface IErc721ContractDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form?: any) => Promise<void>;
  initialValues: IErc721ContractDeployDto;
}

export const Erc721ContractDeployDialog: FC<IErc721ContractDeployDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { contractTemplate } = initialValues;

  const { chainId = 0 } = useWeb3React();

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      testId="Erc721ContractDeployForm"
      {...rest}
    >
      <SelectInput
        name="contractTemplate"
        options={Erc721ContractTemplates}
        readOnly={contractTemplate !== Erc721ContractTemplates.SIMPLE}
        disabledOptions={isTemplateDisabled(chainId)}
      />
      <TextInput name="name" required />
      <TextInput name="symbol" required />
      <TextInput name="baseTokenURI" required />
      <RoyaltyInput />
    </FormDialog>
  );
};
