import { FC } from "react";
import { useWeb3React } from "@web3-react/core";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { Erc998ContractTemplates, IErc998ContractDeployDto, IToken } from "@framework/types";

import { RoyaltyInput } from "../../../../../inputs/royalty";
import { validationSchema } from "./validation";
import { isTemplateDisabled } from "./utils";

export interface IErc998ContractDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IToken>, form?: any) => Promise<void>;
  initialValues: IErc998ContractDeployDto;
}

export const Erc998ContractDeployDialog: FC<IErc998ContractDeployDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { chainId = 0 } = useWeb3React();

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      testId="Erc998ContractDeployForm"
      {...rest}
    >
      <SelectInput
        name="contractTemplate"
        options={Erc998ContractTemplates}
        disabledOptions={isTemplateDisabled(chainId)}
      />
      <TextInput required name="name" />
      <TextInput required name="symbol" />
      <TextInput required name="baseTokenURI" />
      <RoyaltyInput />
    </FormDialog>
  );
};
