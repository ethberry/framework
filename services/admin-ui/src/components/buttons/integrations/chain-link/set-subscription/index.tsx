import { FC, Fragment, useState } from "react";
import { Subscriptions } from "@mui/icons-material";
import { useWeb3React, Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IContract } from "@framework/types";
import { ContractFeatures, ModuleType } from "@framework/types";
import { ListAction, ListActionVariant } from "@framework/styled";
import setSubscriptionIdERC721GenesBesuABI from "@framework/abis/setSubscriptionId/ERC721GenesBesu.json";

import { ChainLinkSetSubscriptionDialog } from "./dialog";
import type { IChainLinkVrfSubscriptionDto } from "./dialog";

export interface IChainLinkSetSubscriptionButtonProps {
  contract: IContract;
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const ChainLinkSetSubscriptionButton: FC<IChainLinkSetSubscriptionButtonProps> = props => {
  const {
    className,
    disabled,
    contract: { address, contractModule, contractFeatures },
    variant = ListActionVariant.button,
  } = props;
  const { account } = useWeb3React();

  const [isSetSubscriptionDialogOpen, setIsSetSubscriptionDialogOpen] = useState(false);

  const metaFnSetSub = useMetamask(async (options: IChainLinkVrfSubscriptionDto, web3Context: Web3ContextType) => {
    // https://docs.chain.link/docs/link-token-contracts/
    const contract = new Contract(address, setSubscriptionIdERC721GenesBesuABI, web3Context.provider?.getSigner());
    return contract.setSubscriptionId(options.vrfSubId) as Promise<void>;
  });

  if (
    contractModule === ModuleType.HIERARCHY &&
    !(contractFeatures.includes(ContractFeatures.RANDOM) || contractFeatures.includes(ContractFeatures.GENES))
  ) {
    return null;
  }

  const handleSetSubscription = (): void => {
    setIsSetSubscriptionDialogOpen(true);
  };

  const handleSetSubscriptionConfirm = async (values: IChainLinkVrfSubscriptionDto): Promise<void> => {
    await metaFnSetSub(values).then(() => {
      setIsSetSubscriptionDialogOpen(false);
    });
  };

  const handleSetSubscriptionCancel = () => {
    setIsSetSubscriptionDialogOpen(false);
  };

  return (
    <Fragment>
      <ListAction
        onClick={handleSetSubscription}
        icon={Subscriptions}
        message="pages.chain-link.set"
        className={className}
        dataTestId="ChainLinkSetSubscriptionButton"
        disabled={disabled || !account}
        variant={variant}
      />
      <ChainLinkSetSubscriptionDialog
        onCancel={handleSetSubscriptionCancel}
        onConfirm={handleSetSubscriptionConfirm}
        open={isSetSubscriptionDialogOpen}
        initialValues={{
          vrfSubId: 0,
        }}
      />
    </Fragment>
  );
};
