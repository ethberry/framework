import { FC, Fragment, MouseEvent, useState } from "react";
import { IconButton, Menu } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import type { IContract } from "@framework/types";

import { TopUpMenuItem } from "../common/top-up";
import { EthListenerAddMenuItem } from "../../common/eth-add";
import { EthListenerRemoveMenuItem } from "../../common/eth-remove";
import { GrantRoleMenuItem } from "../../extensions/grant-role";
import { RevokeRoleMenuItem } from "../../extensions/revoke-role";
import { RenounceRoleMenuItem } from "../../extensions/renounce-role";
import { PauseMenuItem } from "../common/pause";
import { AllowanceMenu } from "./allowance";
import { StakingInfoMenuItem } from "./counters";

export interface IStakingActionsMenu {
  staking: IContract;
  disabled?: boolean;
}

export const StakingActionsMenu: FC<IStakingActionsMenu> = props => {
  const { staking, disabled } = props;

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
        <GrantRoleMenuItem contract={staking} />
        <RevokeRoleMenuItem contract={staking} />
        <RenounceRoleMenuItem contract={staking} />
        <AllowanceMenu contract={staking} />
        <TopUpMenuItem contract={staking} />
        <StakingInfoMenuItem contract={staking} />
        <PauseMenuItem contract={staking} />
        <EthListenerAddMenuItem contract={staking} />
        <EthListenerRemoveMenuItem contract={staking} />
      </Menu>
    </Fragment>
  );
};
