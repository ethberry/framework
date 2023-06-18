import { FC, Fragment, MouseEvent, useState } from "react";

import { IconButton, Menu } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import type { IWaitListList } from "@framework/types";

import { UploadMenuItem } from "./upload";

export interface IWaitListActionsMenu {
  waitListList: IWaitListList;
  disabled?: boolean;
}

export const WaitListActionsMenu: FC<IWaitListActionsMenu> = props => {
  const { waitListList, disabled } = props;

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
        id="waitlist-menu-button"
        aria-controls={open ? "waitlist-actions-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        disabled={disabled}
        data-testid="WaitListActionsMenuButton"
      >
        <MoreVert />
      </IconButton>
      <Menu id="waitlist-actions-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <UploadMenuItem waitListList={waitListList} />
      </Menu>
    </Fragment>
  );
};
