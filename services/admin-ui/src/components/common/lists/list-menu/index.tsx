import { FC, Fragment, MouseEvent, PropsWithChildren, useState } from "react";
import { IconButton, Menu } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

export interface IStyledListMenuProps {
  dataTestId?: string;
  disabled?: boolean;
}

export const StyledListMenu: FC<PropsWithChildren<IStyledListMenuProps>> = props => {
  const { children, dataTestId, disabled } = props;

  const [anchor, setAnchor] = useState<Element | null>(null);
  const open = Boolean(anchor);

  const handleMenuOpen = (event: MouseEvent): void => {
    setAnchor(event.currentTarget);
  };

  const handleMenuClose = (): void => {
    setAnchor(null);
  };

  return (
    <Fragment>
      <IconButton
        onClick={handleMenuOpen}
        aria-label="more"
        id="menu-button"
        aria-controls={open ? "actions-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        disabled={disabled}
        data-testid={dataTestId}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="actions-menu"
        open={open}
        anchorEl={anchor}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        keepMounted
      >
        {children}
      </Menu>
    </Fragment>
  );
};
