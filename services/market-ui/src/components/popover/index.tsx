import { FC, MouseEvent, PropsWithChildren, useState } from "react";
import { IconButton, Popover } from "@mui/material";
import { Help } from "@mui/icons-material";

import { Root, StyledWrapper } from "./styled";

export interface IInfoPopoverProps {
  className?: string;
}

export const InfoPopover: FC<PropsWithChildren<IInfoPopoverProps>> = props => {
  const { children } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    return false;
  };

  const handleClose = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "info" : undefined;

  return (
    <Root>
      <IconButton aria-describedby={id} onClick={handleClick}>
        <Help />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <StyledWrapper>{children}</StyledWrapper>
      </Popover>
    </Root>
  );
};
