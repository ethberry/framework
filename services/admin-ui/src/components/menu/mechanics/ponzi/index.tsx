import { FC, Fragment, MouseEvent, useState } from "react";
import { IconButton, Menu } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import type { IContract } from "@framework/types";

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
      <Menu id="ponzi-actions-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <GrantRoleMenuItem contract={contract} />
        <RevokeRoleMenuItem contract={contract} />
        <RenounceRoleMenuItem contract={contract} />
        <AllowanceMenuItem contract={contract} />
        <TopUpMenuItem contract={contract} />
        <PonziBalanceMenuItem contract={contract} />
      </Menu>
    </Fragment>
  );
};
