import { FC, Fragment, MouseEvent, useState } from "react";
import { IconButton, Menu } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import type { IOrder } from "@framework/types";
import { OrderArchiveMenuItem } from "./archive";

export interface IOrderActionMenu {
  order: IOrder;
  disabled?: boolean;
}

export const OrderActionMenu: FC<IOrderActionMenu> = props => {
  const { order, disabled } = props;

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
        id="contract-menu-button"
        aria-controls={open ? "contract-actions-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        disabled={disabled}
        data-testid="ContractActionsMenuButton"
        sx={{ marginLeft: "auto" }}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="order-actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        keepMounted
      >
        <OrderArchiveMenuItem order={order} />
      </Menu>
    </Fragment>
  );
};
