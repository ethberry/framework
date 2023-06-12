import { FC } from "react";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { PlayCircleOutline } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IContract } from "@framework/types";
import { ContractFeatures } from "@framework/types";

import PauseABI from "../../../../../abis/extensions/pause/pause.abi.json";

export interface IUnPauseMenuItemProps {
  contract: IContract;
}

export const UnPauseMenuItem: FC<IUnPauseMenuItemProps> = props => {
  const {
    contract: { address, isPaused, contractFeatures },
  } = props;

  const metaUnPause = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(address, PauseABI, web3Context.provider?.getSigner());
    return contract.unpause() as Promise<void>;
  });

  const handleUnPause = () => {
    return metaUnPause();
  };

  if (contractFeatures.includes(ContractFeatures.PAUSABLE) && !isPaused) {
    return null;
  }

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
};
