import { FC, Fragment, MouseEvent, useState } from "react";
import { IconButton, Menu } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import type { ITemplate } from "@framework/types";

import { MintMenuItem } from "./mint";

export interface ITemplateActionsMenu {
  template: ITemplate;
  disabled?: boolean;
}

export const TemplateActionsMenu: FC<ITemplateActionsMenu> = props => {
  const { template, disabled } = props;

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
        id="template-menu-button"
        aria-controls={open ? "template-actions-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        disabled={disabled}
        data-testid="TemplateActionsMenuButton"
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="template-actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        keepMounted
      >
        <MintMenuItem template={template} />
      </Menu>
    </Fragment>
  );
};
