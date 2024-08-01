import { FC, Fragment, useState } from "react";
import { Subscriptions } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract, BigNumber } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IContract } from "@framework/types";
import { AccessControlRoleType, ContractFeatures, ModuleType } from "@framework/types";
import { ListAction, ListActionVariant } from "@framework/styled";
import ERC721RandomGemunionSetSubscriptionIdABI from "@framework/abis/json/ERC721RandomGemunion/setSubscriptionId.json";

import { ChainLinkSetSubscriptionDialog } from "./dialog";
import type { IChainLinkVrfSubscriptionDto } from "./dialog";
import { useSetButtonPermission } from "../../../../../shared";

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
    contract,
    variant = ListActionVariant.button,
  } = props;

  const [isSetSubscriptionDialogOpen, setIsSetSubscriptionDialogOpen] = useState(false);

  const { hasPermission } = useSetButtonPermission(AccessControlRoleType.DEFAULT_ADMIN_ROLE, contract?.id);

  const metaFnSetSub = useMetamask(async (options: IChainLinkVrfSubscriptionDto, web3Context: Web3ContextType) => {
    // https://docs.chain.link/docs/link-token-contracts/
    const contract = new Contract(address, ERC721RandomGemunionSetSubscriptionIdABI, web3Context.provider?.getSigner());
    console.log("options.vrfSubId", options.vrfSubId);
    console.log("BigInt.vrfSubId", BigInt(options.vrfSubId.substring(0, options.vrfSubId.length - 1)));
    const uintSub = BigInt(options.vrfSubId.substring(0, options.vrfSubId.length - 1));
    // BigInt(str.substring(0,str.length-1))
    // console.log("BigNumber", BigNumber.from(options.vrfSubId.));
    return contract.setSubscriptionId(uintSub) as Promise<void>; // V2PLUS
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
        disabled={disabled || !hasPermission}
        variant={variant}
      />
      <ChainLinkSetSubscriptionDialog
        onCancel={handleSetSubscriptionCancel}
        onConfirm={handleSetSubscriptionConfirm}
        open={isSetSubscriptionDialogOpen}
        initialValues={{
          vrfSubId: "0n",
        }}
      />
    </Fragment>
  );
};
