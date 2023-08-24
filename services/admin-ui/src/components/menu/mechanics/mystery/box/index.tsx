import { FC, Fragment, MouseEvent, useState } from "react";
import { IconButton, Menu } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import { IMysteryBox } from "@framework/types";

import { MintMenuItem } from "./mint";

export interface IMysteryActionsMenu {
  mystery: IMysteryBox;
  disabled?: boolean;
}

export const MysteryActionsMenu: FC<IMysteryActionsMenu> = props => {
  const { mystery, disabled } = props;

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
        id="mystery-menu-button"
        aria-controls={open ? "mystery-actions-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        disabled={disabled}
        data-testid="MysteryActionsMenuButton"
      >
        <MoreVert />
      </IconButton>
      <Menu id="mystery-actions-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MintMenuItem mystery={mystery} />
      </Menu>
    </Fragment>
  );
};
