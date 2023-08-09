import { FC, Fragment, MouseEvent, useState } from "react";
import { IconButton, Menu } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import type { IContract } from "@framework/types";

import { EthListenerAddMenuItem } from "../../common/eth-add";
import { EthListenerRemoveMenuItem } from "../../common/eth-remove";
import { AllowanceMenuItem } from "../common/allowance";
import { TopUpMenuItem } from "../common/top-up";
import { TransferOwnershipMenuItem } from "./transfer-ownership";

export interface IVestingActionsMenu {
  vesting: IContract;
  disabled?: boolean;
}

export const VestingActionsMenu: FC<IVestingActionsMenu> = props => {
  const { vesting, disabled } = props;

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
        id="vesting-menu-button"
        aria-controls={open ? "vesting-actions-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        disabled={disabled}
        data-testid="VestingActionsMenuButton"
      >
        <MoreVert />
      </IconButton>
      <Menu id="vesting-actions-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <AllowanceMenuItem contract={vesting} />
        <TopUpMenuItem contract={vesting} />
        <TransferOwnershipMenuItem vesting={vesting} />
        <EthListenerAddMenuItem contract={vesting} />
        <EthListenerRemoveMenuItem contract={vesting} />
      </Menu>
    </Fragment>
  );
};
