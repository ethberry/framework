import { FC, Fragment, MouseEvent, useState } from "react";
import { IconButton, Menu } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import { IContract } from "@framework/types";

import { RoyaltyMenuItem } from "../../common/royalty";
import { TransferMenuItem } from "../../common/transfer";
import { ContractGrantRoleMenuItem } from "../../extensions/grant-role";
import { ContractRevokeRoleMenuItem } from "../../extensions/revoke-role";
import { ContractRenounceRoleMenuItem } from "../../extensions/renounce-role";
import { BlacklistMenuItem } from "../../extensions/blacklist-add";
import { UnBlacklistMenuItem } from "../../extensions/blacklist-remove";
import { WhitelistMenuItem } from "../../extensions/whitelist-add";
import { UnWhitelistMenuItem } from "../../extensions/whitelist-remove";
import { AllowanceMenuItem } from "./allowance";
import { MintMenuItem } from "./mint";
import { Erc20TokenSnapshotMenuItem } from "./snapshot";

export interface IContractActionsMenu {
  contract: IContract;
  disabled?: boolean;
}

export const ContractActionsMenu: FC<IContractActionsMenu> = props => {
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
        id="contract-menu-button"
        aria-controls={open ? "contract-actions-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        disabled={disabled}
        data-testid="ContractActionsMenuButton"
      >
        <MoreVert />
      </IconButton>
      <Menu id="contract-actions-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <ContractGrantRoleMenuItem contract={contract} />
        <ContractRevokeRoleMenuItem contract={contract} />
        <ContractRenounceRoleMenuItem contract={contract} />

        <MintMenuItem contract={contract} />
        <Erc20TokenSnapshotMenuItem contract={contract} />
        <RoyaltyMenuItem contract={contract} />

        <BlacklistMenuItem contract={contract} />
        <UnBlacklistMenuItem contract={contract} />

        <WhitelistMenuItem contract={contract} />
        <UnWhitelistMenuItem contract={contract} />

        <AllowanceMenuItem contract={contract} />
        <TransferMenuItem contract={contract} />
      </Menu>
    </Fragment>
  );
};
