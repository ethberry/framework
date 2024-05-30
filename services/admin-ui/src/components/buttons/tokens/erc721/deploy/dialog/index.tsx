import { FC } from "react";
import { useWeb3React } from "@web3-react/core";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { Erc721ContractTemplates, IContract, IErc721ContractDeployDto } from "@framework/types";

import { RoyaltyInput } from "../../../../../inputs/royalty";
import { validationSchema } from "./validation";
import { ChainLinkSupportedChains } from "@framework/types/dist/entities/integrations/chain-link/supported";

export interface IErc721ContractDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form?: any) => Promise<void>;
  initialValues: IErc721ContractDeployDto;
}

export const Erc721ContractDeployDialog: FC<IErc721ContractDeployDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { contractTemplate } = initialValues;

  const { chainId } = useWeb3React();

  const disabledTemplates =
    chainId && Object.values(ChainLinkSupportedChains).includes(chainId)
      ? [
          // there templates are not ready yet
          Erc721ContractTemplates.BLACKLIST_DISCRETE_RENTABLE,
          Erc721ContractTemplates.BLACKLIST_DISCRETE_RENTABLE_RANDOM,
          Erc721ContractTemplates.GENES,
          Erc721ContractTemplates.RENTABLE,
          // these templates meant to be deployed using mechanic page
          Erc721ContractTemplates.RAFFLE,
          Erc721ContractTemplates.LOTTERY,
        ]
      : [
          // disable random templates for unsupported chains
          Erc721ContractTemplates.RANDOM,
          Erc721ContractTemplates.DISCRETE_RANDOM,
          Erc721ContractTemplates.BLACKLIST_DISCRETE_RANDOM,
          Erc721ContractTemplates.BLACKLIST_RANDOM,
          // there templates are not ready yet
          Erc721ContractTemplates.BLACKLIST_DISCRETE_RENTABLE,
          Erc721ContractTemplates.BLACKLIST_DISCRETE_RENTABLE_RANDOM,
          Erc721ContractTemplates.GENES,
          Erc721ContractTemplates.RENTABLE,
          // these templates meant to be deployed using mechanic page
          Erc721ContractTemplates.RAFFLE,
          Erc721ContractTemplates.LOTTERY,
        ];

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
        disabledOptions={disabledTemplates}
      />
      <TextInput name="name" />
      <TextInput name="symbol" />
      <TextInput name="baseTokenURI" />
      <RoyaltyInput />
    </FormDialog>
  );
};
