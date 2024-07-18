import { FC } from "react";
import { PauseCircleOutline } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { AccessControlRoleType, ContractFeatures } from "@framework/types";

import PauseABI from "@framework/abis/json/Pausable/pause.json";
import { shouldDisableByContractType } from "../../../../utils";
import { useSetButtonPermission } from "../../../../../shared";

export interface IPauseButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const PauseButton: FC<IPauseButtonProps> = props => {
  const {
    className,
    contract,
    contract: { address, isPaused, contractFeatures },
    disabled,
    variant,
  } = props;

  const { isButtonAvailable } = useSetButtonPermission(AccessControlRoleType.PAUSER_ROLE, contract?.id);

  const metaPause = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(address, PauseABI, web3Context.provider?.getSigner());
    return contract.pause() as Promise<void>;
  });

  const handlePause = () => {
    return metaPause();
  };

  if (!contractFeatures.includes(ContractFeatures.PAUSABLE) || isPaused) {
    return null;
  }

  return (
    <ListAction
      onClick={handlePause}
      icon={PauseCircleOutline}
      message="form.buttons.pause"
      className={className}
      dataTestId="PauseButton"
      disabled={disabled || shouldDisableByContractType(contract) || !isButtonAvailable}
      variant={variant}
    />
  );
};
