import { FC, Fragment, MouseEvent, useState } from "react";
import { IconButton, Menu, Divider } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import type { IContract } from "@framework/types";

import { EthListenerAddMenuItem } from "../../common/eth-add";
import { EthListenerRemoveMenuItem } from "../../common/eth-remove";
import { GrantRoleMenuItem } from "../../extensions/grant-role";
import { RevokeRoleMenuItem } from "../../extensions/revoke-role";
import { RenounceRoleMenuItem } from "../../extensions/renounce-role";
import { TopUpMenuItem } from "../common/top-up";
import { PauseMenuItem } from "../common/pause";
import { UnPauseMenuItem } from "../common/unpause";
import { AllowanceMenu } from "./allowance";

export interface IStakingActionsMenu {
  contract: IContract;
  disabled?: boolean;
}

export const StakingActionsMenu: FC<IStakingActionsMenu> = props => {
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
        id="staking-menu-button"
        aria-controls={open ? "staking-actions-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        disabled={disabled}
        data-testid="StakingActionsMenuButton"
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="staking-actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        keepMounted
      >
        <GrantRoleMenuItem contract={contract} />
        <RevokeRoleMenuItem contract={contract} />
        <RenounceRoleMenuItem contract={contract} />
        <Divider sx={{ m: 2 }} />
        <PauseMenuItem contract={contract} />
        <UnPauseMenuItem contract={contract} />
        <Divider sx={{ m: 2 }} />
        <AllowanceMenu contract={contract} />
        <TopUpMenuItem contract={contract} />
        <Divider sx={{ m: 2 }} />
        <EthListenerAddMenuItem contract={contract} />
        <EthListenerRemoveMenuItem contract={contract} />
      </Menu>
    </Fragment>
  );
};
