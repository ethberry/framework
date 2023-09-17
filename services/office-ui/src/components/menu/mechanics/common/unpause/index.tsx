import { FC } from "react";
import { PlayCircleOutline } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IContract } from "@framework/types";
import { ContractFeatures } from "@framework/types";

import PauseABI from "../../../../../abis/extensions/pause/pause.abi.json";

export interface IUnPauseMenuItemProps {
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const UnPauseMenuItem: FC<IUnPauseMenuItemProps> = props => {
  const {
    contract: { address, isPaused, contractFeatures },
    disabled,
    variant,
  } = props;

  const metaUnPause = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(address, PauseABI, web3Context.provider?.getSigner());
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
      disabled={disabled}
      variant={variant}
    />
  );
};
