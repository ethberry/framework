import { FC, Fragment, MouseEvent, useState } from "react";
import { IconButton, Menu } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import { IContract } from "@framework/types";

import { RaffleRoundStartMenuItem } from "./round-start";
import { RaffleRoundEndMenuItem } from "./round-end";
import { RaffleScheduleLightMenuItem } from "./schedule-light";

export interface IRaffleActionsMenu {
  contract: IContract;
  disabled?: boolean;
}

export const RaffleActionsMenu: FC<IRaffleActionsMenu> = props => {
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
        id="raffle-menu-button"
        aria-controls={open ? "raffle-actions-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        disabled={disabled}
        data-testid="RaffleActionsMenuButton"
      >
        <MoreVert />
      </IconButton>
      <Menu id="raffle-actions-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <RaffleRoundStartMenuItem contract={contract} />
        <RaffleRoundEndMenuItem contract={contract} />
        <RaffleScheduleLightMenuItem contract={contract} />
      </Menu>
    </Fragment>
  );
};
