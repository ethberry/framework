import { FC } from "react";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { PauseCircleOutline } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IContract } from "@framework/types";
import { ContractFeatures } from "@framework/types";

import PauseABI from "../../../../../abis/extensions/pause/pause.abi.json";

export interface IPausableMenuItemProps {
  contract: IContract;
}

export const PauseMenuItem: FC<IPausableMenuItemProps> = props => {
  const {
    contract: { address, isPaused, contractFeatures },
  } = props;

  const metaPause = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(address, PauseABI, web3Context.provider?.getSigner());
    return contract.pause() as Promise<void>;
  });

  const handlePause = () => {
    return metaPause();
  };

  if (contractFeatures.includes(ContractFeatures.PAUSABLE) && isPaused) {
    return null;
  }

  return (
    <MenuItem onClick={handlePause}>
      <ListItemIcon>
        <PauseCircleOutline fontSize="small" />
      </ListItemIcon>
      <Typography variant="inherit">
        <FormattedMessage id="form.buttons.pause" />
      </Typography>
    </MenuItem>
  );
};
