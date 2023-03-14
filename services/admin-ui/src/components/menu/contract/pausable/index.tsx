import { FC } from "react";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { PauseCircleOutline, PlayCircleOutline } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IContract } from "@framework/types";

import PauseABI from "./pause.abi.json";
import UnPauseABI from "./unpause.abi.json";

export interface IPausableMenuItemProps {
  contract: IContract;
}

export const PausableMenuItem: FC<IPausableMenuItemProps> = props => {
  const {
    contract: { address, isPaused },
  } = props;

  const metaPause = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(address, PauseABI, web3Context.provider?.getSigner());
    return contract.pause() as Promise<void>;
  });

  const metaUnPause = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(address, UnPauseABI, web3Context.provider?.getSigner());
    return contract.unpause() as Promise<void>;
  });

  const handlePause = () => {
    return metaPause();
  };

  const handleUnPause = () => {
    return metaUnPause();
  };

  if (isPaused) {
    return (
      <MenuItem onClick={handleUnPause}>
        <ListItemIcon>
          <PlayCircleOutline fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.unpause" />
        </Typography>
      </MenuItem>
    );
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
