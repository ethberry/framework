import { FC, Fragment, MouseEvent, useState } from "react";
import { IconButton, Menu } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import type { IContract } from "@framework/types";

import { GrantRoleMenuItem } from "../../extensions/grant-role";
import { RevokeRoleMenuItem } from "../../extensions/revoke-role";
import { RenounceRoleMenuItem } from "../../extensions/renounce-role";
import { AllowanceMenuItem } from "../common/allowance";
import { PyramidBalanceMenuItem } from "./pyramid-balances";
import { TopUpMenuItem } from "../common/top-up";

export interface IPyramidActionsMenu {
  contract: IContract;
  disabled?: boolean;
}

export const PyramidActionsMenu: FC<IPyramidActionsMenu> = props => {
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
        id="pyramid-menu-button"
        aria-controls={open ? "pyramid-actions-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        disabled={disabled}
        data-testid="PyramidActionsMenuButton"
      >
        <MoreVert />
      </IconButton>
      <Menu id="pyramid-actions-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <GrantRoleMenuItem contract={contract} />
        <RevokeRoleMenuItem contract={contract} />
        <RenounceRoleMenuItem contract={contract} />
        <AllowanceMenuItem contract={contract} />
        <TopUpMenuItem contract={contract} />
        <PyramidBalanceMenuItem contract={contract} />
      </Menu>
    </Fragment>
  );
};
