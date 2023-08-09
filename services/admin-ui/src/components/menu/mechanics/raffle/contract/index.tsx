import { FC, Fragment, MouseEvent, useState } from "react";
import { IconButton, Menu, Divider } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import type { IContract } from "@framework/types";

import { ContractGrantRoleMenuItem } from "../../../extensions/grant-role";
import { ContractRevokeRoleMenuItem } from "../../../extensions/revoke-role";
import { ContractRenounceRoleMenuItem } from "../../../extensions/renounce-role";
import { PauseMenuItem } from "../../common/pause";
import { UnPauseMenuItem } from "../../common/unpause";
import { RaffleRoundStartMenuItem } from "./round-start";
import { RaffleRoundEndMenuItem } from "./round-end";
import { RaffleScheduleMenuItem } from "./schedule";

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
        <ContractGrantRoleMenuItem contract={contract} />
        <ContractRevokeRoleMenuItem contract={contract} />
        <ContractRenounceRoleMenuItem contract={contract} />
        <Divider sx={{ m: 2 }} />
        <PauseMenuItem contract={contract} />
        <UnPauseMenuItem contract={contract} />
        <Divider sx={{ m: 2 }} />
        <RaffleRoundStartMenuItem contract={contract} />
        <RaffleRoundEndMenuItem contract={contract} />
        <RaffleScheduleMenuItem contract={contract} />
      </Menu>
    </Fragment>
  );
};
