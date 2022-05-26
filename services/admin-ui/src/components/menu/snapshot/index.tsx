import { FC } from "react";
import { MenuItem, ListItemIcon, Typography } from "@mui/material";
import { PaidOutlined } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import ERC20Simple from "@framework/binance-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";

export interface IErc20TokenSnapshotMenuItemProps {
  address: string;
}

export const IErc20TokenSnapshotMenuItem: FC<IErc20TokenSnapshotMenuItemProps> = props => {
  const { address } = props;

  const { library } = useWeb3React();

  const handleSnapshot = useMetamask(() => {
    const contract = new Contract(address, ERC20Simple.abi, library.getSigner());
    return contract.snapshot() as Promise<void>;
  });

  return (
    <MenuItem onClick={handleSnapshot}>
      <ListItemIcon>
        <PaidOutlined fontSize="small" />
      </ListItemIcon>
      <Typography variant="inherit">
        <FormattedMessage id="form.buttons.snapshot" />
      </Typography>
    </MenuItem>
  );
};
