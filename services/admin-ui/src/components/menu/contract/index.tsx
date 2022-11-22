import { FC, Fragment, MouseEvent, useState } from "react";
import { IconButton, Menu } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import { IContract, ModuleType, TokenType } from "@framework/types";

import { IErc20TokenSnapshotMenuItem } from "./snapshot";
import { RoyaltyMenuItem } from "./royalty";
import { ContractGrantRoleMenuItem } from "./grant-role";
import { ContractRevokeRoleMenuItem } from "./revoke-role";
import { ContractRenounceRoleMenuItem } from "./renounce-role";
import { BlacklistAddMenuItem } from "./blacklist-add";
import { UnBlacklistMenuItem } from "./blacklist-remove";
import { MintMenuItem } from "./mint";
import { PausableMenuItem } from "./pausable";
import { EthListenerAddMenuItem } from "./eth-add";
import { EthListenerRemoveMenuItem } from "./eth-remove";
import { PyramidBalanceMenuItem } from "./pyramid-balances";

export enum ContractActions {
  SNAPSHOT = "SNAPSHOT",
  ROYALTY = "ROYALTY",
  BLACKLIST_ADD = "BLACKLIST_ADD",
  BLACKLIST_REMOVE = "BLACKLIST_REMOVE",
  PAUSABLE = "PAUSABLE",
}

export interface IContractActionsMenu {
  contract: IContract;
  disabled?: boolean;
  actions?: Array<ContractActions | null>;
}

export const ContractActionsMenu: FC<IContractActionsMenu> = props => {
  const { contract, disabled, actions = [] } = props;

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
        {contract.contractType !== TokenType.NATIVE ? <MintMenuItem contract={contract} /> : null}
        {contract.contractType !== TokenType.NATIVE ? <EthListenerAddMenuItem contract={contract} /> : null}
        {contract.contractType !== TokenType.NATIVE ? <EthListenerRemoveMenuItem contract={contract} /> : null}
        {actions.includes(ContractActions.SNAPSHOT) ? <IErc20TokenSnapshotMenuItem contract={contract} /> : null}
        {actions.includes(ContractActions.ROYALTY) ? <RoyaltyMenuItem contract={contract} /> : null}
        <ContractGrantRoleMenuItem contract={contract} />
        <ContractRevokeRoleMenuItem contract={contract} />
        <ContractRenounceRoleMenuItem contract={contract} />
        {actions.includes(ContractActions.BLACKLIST_ADD) ? <BlacklistAddMenuItem contract={contract} /> : null}
        {actions.includes(ContractActions.BLACKLIST_REMOVE) ? <UnBlacklistMenuItem contract={contract} /> : null}
        {actions.includes(ContractActions.PAUSABLE) ? <PausableMenuItem contract={contract} /> : null}
        {contract.contractModule === ModuleType.PYRAMID ? <PyramidBalanceMenuItem contract={contract} /> : null}
      </Menu>
    </Fragment>
  );
};
