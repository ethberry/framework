import { FC, Fragment, useState } from "react";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IContract } from "@framework/types";

import whiteListABI from "./whitelist.abi.json";

import { AccountDialog, IAccountDto } from "../../../dialogs/account";

export interface IWhitelistMenuItemProps {
  contract: IContract;
}

export const WhitelistAddMenuItem: FC<IWhitelistMenuItemProps> = props => {
  const {
    contract: { address },
  } = props;

  const [isWhitelistDialogOpen, setIsWhitelistDialogOpen] = useState(false);

  const handleWhitelist = (): void => {
    setIsWhitelistDialogOpen(true);
  };

  const handleWhitelistCancel = (): void => {
    setIsWhitelistDialogOpen(false);
  };

  const metaFn = useMetamask((values: IAccountDto, web3Context: Web3ContextType) => {
    const contract = new Contract(address, whiteListABI, web3Context.provider?.getSigner());
    return contract.whitelist(values.account) as Promise<void>;
  });

  const handleWhitelistConfirmed = async (values: IAccountDto): Promise<void> => {
    await metaFn(values).finally(() => {
      setIsWhitelistDialogOpen(false);
    });
  };

  return (
    <Fragment>
      <MenuItem onClick={handleWhitelist}>
        <ListItemIcon>
          <CheckCircle fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.whitelist" />
        </Typography>
      </MenuItem>
      <AccountDialog
        onCancel={handleWhitelistCancel}
        onConfirm={handleWhitelistConfirmed}
        open={isWhitelistDialogOpen}
        message="dialogs.whitelist"
        testId="AccessListWhitelistForm"
        initialValues={{
          account: "",
        }}
      />
    </Fragment>
  );
};
