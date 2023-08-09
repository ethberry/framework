import { FC, Fragment, MouseEvent, useState } from "react";
import { IconButton, Menu } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import type { IContract } from "@framework/types";

import { TopUpMenuItem } from "./top-up";
import { AllowanceMenuItem } from "./allowance";

export interface ICommonActionsMenu {
  contract: IContract;
  disabled?: boolean;
}

export const CommonActionsMenu: FC<ICommonActionsMenu> = props => {
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
        id="common-menu-button"
        aria-controls={open ? "common-actions-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        disabled={disabled}
        data-testid="CommonActionsMenuButton"
      >
        <MoreVert />
      </IconButton>
      <Menu id="common-actions-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <AllowanceMenuItem contract={contract} />
        <TopUpMenuItem contract={contract} />
      </Menu>
    </Fragment>
  );
};
