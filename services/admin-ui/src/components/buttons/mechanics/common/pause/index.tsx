import { FC } from "react";
import { PauseCircleOutline } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IContract } from "@framework/types";
import { ContractFeatures } from "@framework/types";

import PauseABI from "../../../../../abis/extensions/pause/pause.abi.json";

export interface IPausableButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const PauseButton: FC<IPausableButtonProps> = props => {
  const {
    className,
    contract: { address, isPaused, contractFeatures },
    disabled,
    variant,
  } = props;

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
      disabled={disabled}
      variant={variant}
    />
  );
};
