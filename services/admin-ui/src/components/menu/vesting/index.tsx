import { FC, Fragment, MouseEvent, useState } from "react";
import { IconButton, Menu } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import { IContract } from "@framework/types";

import { EthListenerAddMenuItem } from "../contract/eth-add";
import { EthListenerRemoveMenuItem } from "../contract/eth-remove";
import { VestingAllowanceMenu } from "./allowance";
import { FundMenuItem } from "./fund";
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
        <VestingAllowanceMenu contract={vesting} />
        <FundMenuItem contract={vesting} />
        <TransferOwnershipMenuItem vesting={vesting} />
        <EthListenerAddMenuItem contract={vesting} />
        <EthListenerRemoveMenuItem contract={vesting} />
      </Menu>
    </Fragment>
  );
};
