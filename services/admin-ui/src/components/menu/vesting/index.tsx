import { FC, Fragment, MouseEvent, useState } from "react";
import { IconButton, Menu } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import { IVesting } from "@framework/types";
import { FundMenuItem } from "./fund";
import { EthListenerAddMenuItem } from "../contract/eth-listener/add";
import { EthListenerRemoveMenuItem } from "../contract/eth-listener/remove";

export enum VestingActions {}

export interface IVestingActionsMenu {
  vesting: IVesting;
  disabled?: boolean;
  actions?: Array<VestingActions | null>;
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
        <FundMenuItem vesting={vesting} />
        <EthListenerAddMenuItem contract={vesting.contract!} />
        <EthListenerRemoveMenuItem
          // contract={contract}
          itemType={{
            address: vesting.contract!.address,
            contractType: vesting.contract!.contractType,
            contractModule: vesting.contract!.contractModule,
          }}
        />
      </Menu>
    </Fragment>
  );
};
