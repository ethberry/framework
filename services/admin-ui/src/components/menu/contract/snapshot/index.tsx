import { FC } from "react";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IContract } from "@framework/types";

import SnapshotABI from "./snapshot.abi.json";

export interface IErc20TokenSnapshotMenuItemProps {
  contract: IContract;
}

export const Erc20TokenSnapshotMenuItem: FC<IErc20TokenSnapshotMenuItemProps> = props => {
  const {
    contract: { address },
  } = props;

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(address, SnapshotABI, web3Context.provider?.getSigner());
    return contract.snapshot() as Promise<void>;
  });

  const handleSnapshot = async () => {
    await metaFn();
  };

  return (
    <MenuItem onClick={handleSnapshot}>
      <ListItemIcon>
        <PhotoCamera fontSize="small" />
      </ListItemIcon>
      <Typography variant="inherit">
        <FormattedMessage id="form.buttons.snapshot" />
      </Typography>
    </MenuItem>
  );
};
