import { FC } from "react";
import { PlayCircleOutline } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { AccessControlRoleType, ContractFeatures } from "@framework/types";

import unpausePausableABI from "@framework/abis/json/Pausable/unpause.json";

import { shouldDisableByContractType } from "../../../utils";
import { useSetButtonPermission } from "../../../../../shared";

export interface IUnPauseButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const UnPauseButton: FC<IUnPauseButtonProps> = props => {
  const {
    className,
    contract,
    contract: { address, isPaused, contractFeatures },
    disabled,
    variant,
  } = props;

  const { hasPermission } = useSetButtonPermission(AccessControlRoleType.PAUSER_ROLE, contract?.id);

  const metaUnPause = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(address, unpausePausableABI, web3Context.provider?.getSigner());
    return contract.unpause() as Promise<void>;
  });

  const handleUnPause = () => {
    return metaUnPause();
  };

  if (!contractFeatures.includes(ContractFeatures.PAUSABLE) || !isPaused) {
    return null;
  }

  return (
    <ListAction
      onClick={handleUnPause}
      icon={PlayCircleOutline}
      message="form.buttons.unpause"
      className={className}
      dataTestId="UnPauseButton"
      disabled={disabled || shouldDisableByContractType(contract) || !hasPermission}
      variant={variant}
    />
  );
};
