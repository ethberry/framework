import { FC, Fragment, useState } from "react";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { DoNotDisturbOn } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IContract } from "@framework/types";

import BlacklistAPI from "./blacklist.abi.json";

import { AccountDialog, IAccountDto } from "../../../dialogs/account";

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

  const metaFn = useMetamask((values: IAccountDto, web3Context: Web3ContextType) => {
    const contract = new Contract(address, BlacklistAPI, web3Context.provider?.getSigner());
    return contract.blacklist(values.account) as Promise<void>;
  });

  const handleBlacklistConfirmed = async (values: IAccountDto): Promise<void> => {
    await metaFn(values).finally(() => {
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
      <AccountDialog
        onCancel={handleBlacklistCancel}
        onConfirm={handleBlacklistConfirmed}
        open={isBlacklistDialogOpen}
        message="dialogs.blacklist"
        testId="AccessListBlacklistForm"
        initialValues={{
          account: "",
        }}
      />
    </Fragment>
  );
};
