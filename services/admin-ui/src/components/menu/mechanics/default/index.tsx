import { FC, Fragment, MouseEvent, useState } from "react";
import { IconButton, Menu } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import type { IContract } from "@framework/types";

import { GrantRoleMenuItem } from "../../extensions/grant-role";
import { RevokeRoleMenuItem } from "../../extensions/revoke-role";
import { RenounceRoleMenuItem } from "../../extensions/renounce-role";

export interface IDefaultContractActionsMenu {
  contract: IContract;
  disabled?: boolean;
}

export const DefaultContractActionsMenu: FC<IDefaultContractActionsMenu> = props => {
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
        id="default-menu-button"
        aria-controls={open ? "default-actions-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        disabled={disabled}
        data-testid="DefaultActionsMenuButton"
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="default-actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        keepMounted
      >
        <GrantRoleMenuItem contract={contract} />
        <RevokeRoleMenuItem contract={contract} />
        <RenounceRoleMenuItem contract={contract} />
      </Menu>
    </Fragment>
  );
};
