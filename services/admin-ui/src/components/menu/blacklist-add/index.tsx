import { FC, useState } from "react";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { DoNotDisturbOn } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import ERC20BlacklistSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Blacklist.sol/ERC20Blacklist.json";

import { AccessListBlacklistDialog, IBlacklistDto } from "./edit";

export interface IBlacklistMenuItemProps {
  address: string;
}

export const BlacklistAddMenuItem: FC<IBlacklistMenuItemProps> = props => {
  const { address } = props;

  const [isBlacklistDialogOpen, setIsBlacklistDialogOpen] = useState(false);

  const { provider } = useWeb3React();

  const handleBlacklist = (): void => {
    setIsBlacklistDialogOpen(true);
  };

  const handleBlacklistCancel = (): void => {
    setIsBlacklistDialogOpen(false);
  };

  const meta = useMetamask((values: IBlacklistDto) => {
    const contract = new Contract(address, ERC20BlacklistSol.abi, provider?.getSigner());
    return contract.blacklist(values.account) as Promise<void>;
  });

  const handleBlacklistConfirmed = async (values: IBlacklistDto): Promise<void> => {
    await meta(values).finally(() => {
      setIsBlacklistDialogOpen(false);
    });
  };

  return (
    <>
      <MenuItem onClick={handleBlacklist}>
        <ListItemIcon>
          <DoNotDisturbOn fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.blacklist" />
        </Typography>
      </MenuItem>
      <AccessListBlacklistDialog
        onCancel={handleBlacklistCancel}
        onConfirm={handleBlacklistConfirmed}
        open={isBlacklistDialogOpen}
        initialValues={{
          account: "",
        }}
      />
    </>
  );
};
