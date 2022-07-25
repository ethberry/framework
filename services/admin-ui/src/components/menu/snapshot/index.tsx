import { FC } from "react";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import ERC20SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";

export interface IErc20TokenSnapshotMenuItemProps {
  address: string;
}

export const IErc20TokenSnapshotMenuItem: FC<IErc20TokenSnapshotMenuItemProps> = props => {
  const { address } = props;

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    const contract = new Contract(address, ERC20SimpleSol.abi, web3Context.provider?.getSigner());
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
