import { FC, Fragment, useState } from "react";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { DoNotDisturbOn } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { IContract } from "@framework/types";
import ERC20BlacklistSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Blacklist.sol/ERC20Blacklist.json";

import { AccessListBlacklistDialog, IBlacklistDto } from "./edit";

export interface IBlacklistMenuItemProps {
  contract: IContract;
}

export const BlacklistAddMenuItem: FC<IBlacklistMenuItemProps> = props => {
  const {
    contract: { address },
  } = props;

  const [isBlacklistDialogOpen, setIsBlacklistDialogOpen] = useState(false);

  const handleBlacklist = (): void => {
    setIsBlacklistDialogOpen(true);
  };

  const handleBlacklistCancel = (): void => {
    setIsBlacklistDialogOpen(false);
  };

  const meta = useMetamask((values: IBlacklistDto, web3Context: Web3ContextType) => {
    const contract = new Contract(address, ERC20BlacklistSol.abi, web3Context.provider?.getSigner());
    return contract.blacklist(values.account) as Promise<void>;
  });

  const handleBlacklistConfirmed = async (values: IBlacklistDto): Promise<void> => {
    await meta(values).finally(() => {
      setIsBlacklistDialogOpen(false);
    });
  };

  return (
    <Fragment>
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
    </Fragment>
  );
};
