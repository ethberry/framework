import { FC, Fragment, MouseEvent, useState } from "react";
import { IconButton, Menu, Divider } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import type { IContract } from "@framework/types";

import { GrantRoleMenuItem } from "../../../extensions/grant-role";
import { RevokeRoleMenuItem } from "../../../extensions/revoke-role";
import { RenounceRoleMenuItem } from "../../../extensions/renounce-role";
import { PauseMenuItem } from "../../common/pause";
import { UnPauseMenuItem } from "../../common/unpause";
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
        <GrantRoleMenuItem contract={contract} />
        <RevokeRoleMenuItem contract={contract} />
        <RenounceRoleMenuItem contract={contract} />
        <Divider sx={{ m: 2 }} />
        <PauseMenuItem contract={contract} />
        <UnPauseMenuItem contract={contract} />
        <Divider sx={{ m: 2 }} />
        <LotteryRoundStartMenuItem contract={contract} />
        <LotteryRoundEndMenuItem contract={contract} />
        <LotteryScheduleMenuItem contract={contract} />
      </Menu>
    </Fragment>
  );
};
