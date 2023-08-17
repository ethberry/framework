import { FC, Fragment, MouseEvent, useState } from "react";
import { Divider, IconButton, Menu } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import type { IContract } from "@framework/types";

import { GrantRoleMenuItem } from "../../../extensions/grant-role";
import { RevokeRoleMenuItem } from "../../../extensions/revoke-role";
import { RenounceRoleMenuItem } from "../../../extensions/renounce-role";
import { PauseMenuItem } from "../../common/pause";
import { UnPauseMenuItem } from "../../common/unpause";
import { RaffleRoundStartMenuItem } from "./round-start";
import { RaffleRoundEndMenuItem } from "./round-end";
import { RaffleScheduleMenuItem } from "./schedule";

export interface IRaffleActionsMenu {
  contract: IContract;
  disabled?: boolean;
  refreshPage: () => Promise<void>;
}

export const RaffleActionsMenu: FC<IRaffleActionsMenu> = props => {
  const { contract, disabled, refreshPage } = props;

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
        <GrantRoleMenuItem contract={contract} />
        <RevokeRoleMenuItem contract={contract} />
        <RenounceRoleMenuItem contract={contract} />
        <Divider sx={{ m: 2 }} />
        <PauseMenuItem contract={contract} />
        <UnPauseMenuItem contract={contract} />
        <Divider sx={{ m: 2 }} />
        <RaffleRoundStartMenuItem contract={contract} />
        <RaffleRoundEndMenuItem contract={contract} />
        <RaffleScheduleMenuItem contract={contract} refreshPage={refreshPage} />
      </Menu>
    </Fragment>
  );
};
