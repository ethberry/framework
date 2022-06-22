import { FC, useState } from "react";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { NoAccounts } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import ERC20BlackListSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20BlackList.sol/ERC20BlackList.json";

import { AccessListBlacklistDialog, IBlacklistDto } from "./edit";

export interface IBlacklistMenuItemProps {
  address: string;
}

export const BlacklistAddMenuItem: FC<IBlacklistMenuItemProps> = props => {
  const { address } = props;

  const [isBlacklistDialogOpen, setIsBlacklistDialogOpen] = useState(false);

  const { library } = useWeb3React();

  const handleBlacklist = (): void => {
    setIsBlacklistDialogOpen(true);
  };

  const handleBlacklistCancel = (): void => {
    setIsBlacklistDialogOpen(false);
  };

  const meta = useMetamask((values: IBlacklistDto) => {
    const contract = new Contract(address, ERC20BlackListSol.abi, library.getSigner());
    return contract.blacklist(values.address) as Promise<void>;
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
          <NoAccounts fontSize="small" />
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
          address: "",
        }}
      />
    </>
  );
};
