import { FC, Fragment, MouseEvent, useState } from "react";
import { IconButton, Menu, Divider } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import type { IContract } from "@framework/types";

import { EthListenerAddMenuItem } from "../../common/eth-add";
import { EthListenerRemoveMenuItem } from "../../common/eth-remove";
import { GrantRoleMenuItem } from "../../extensions/grant-role";
import { RevokeRoleMenuItem } from "../../extensions/revoke-role";
import { RenounceRoleMenuItem } from "../../extensions/renounce-role";
import { AllowanceMenuItem } from "../common/allowance";
import { PonziBalanceMenuItem } from "./ponzi-balances";
import { TopUpMenuItem } from "../common/top-up";

export interface IPonziActionsMenu {
  contract: IContract;
  disabled?: boolean;
}

export const PonziActionsMenu: FC<IPonziActionsMenu> = props => {
  const { contract, disabled } = props;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <IconButton
        aria-label="more"
        id="ponzi-menu-button"
        aria-controls={open ? "ponzi-actions-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        disabled={disabled}
        data-testid="PonziActionsMenuButton"
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="ponzi-actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        keepMounted
      >
        <GrantRoleMenuItem contract={contract} />
        <RevokeRoleMenuItem contract={contract} />
        <RenounceRoleMenuItem contract={contract} />
        <Divider sx={{ m: 2 }} />
        <PonziBalanceMenuItem contract={contract} />
        <Divider sx={{ m: 2 }} />
        <AllowanceMenuItem contract={contract} />
        <TopUpMenuItem contract={contract} />
        <Divider sx={{ m: 2 }} />
        <EthListenerAddMenuItem contract={contract} />
        <EthListenerRemoveMenuItem contract={contract} />
      </Menu>
    </Fragment>
  );
};
