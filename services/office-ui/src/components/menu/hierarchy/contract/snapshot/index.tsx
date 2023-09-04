import { FC } from "react";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IContract } from "@framework/types";
import { TokenType } from "@framework/types";

import ERC20SnapshotABI from "../../../../../abis/hierarchy/erc20/snapshot/snapshot.abi.json";

export interface IErc20TokenSnapshotMenuItemProps {
  contract: IContract;
}

export const SnapshotMenuItem: FC<IErc20TokenSnapshotMenuItemProps> = props => {
  const {
    contract: { address, contractType },
  } = props;

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(address, ERC20SnapshotABI, web3Context.provider?.getSigner());
    return contract.snapshot() as Promise<void>;
  });

  const handleSnapshot = async () => {
    await metaFn();
  };

  if (contractType !== TokenType.ERC20) {
    return null;
  }

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
