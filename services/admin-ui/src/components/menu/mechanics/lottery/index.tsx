import { FC, Fragment, MouseEvent, useState } from "react";
import { IconButton, Menu } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import { IContract } from "@framework/types";

import { LotteryRoundStartMenuItem } from "./round-start";
import { LotteryRoundEndMenuItem } from "./round-end";
import { LotteryScheduleMenuItem } from "./schedule";

export interface ILotteryActionsMenu {
  contract: IContract;
  disabled?: boolean;
}

export const LotteryActionsMenu: FC<ILotteryActionsMenu> = props => {
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
        id="lottery-menu-button"
        aria-controls={open ? "lottery-actions-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        disabled={disabled}
        data-testid="LotteryActionsMenuButton"
      >
        <MoreVert />
      </IconButton>
      <Menu id="lottery-actions-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <LotteryRoundStartMenuItem contract={contract} />
        <LotteryRoundEndMenuItem contract={contract} />
        <LotteryScheduleMenuItem contract={contract} />
      </Menu>
    </Fragment>
  );
};
