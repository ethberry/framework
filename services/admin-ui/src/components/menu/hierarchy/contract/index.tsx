import { FC, Fragment, MouseEvent, useState } from "react";
import { IconButton, Menu } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import { ContractFeatures, IContract, ModuleType, TokenType } from "@framework/types";

import { RoyaltyMenuItem } from "../../common/royalty";
import { EthListenerAddMenuItem } from "../../common/eth-add";
import { EthListenerRemoveMenuItem } from "../../common/eth-remove";
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

        {contract.contractType !== TokenType.NATIVE &&
        contract.contractModule === ModuleType.HIERARCHY &&
        !contract.contractFeatures.includes(ContractFeatures.RANDOM) &&
        !contract.contractFeatures.includes(ContractFeatures.GENES) ? (
          <MintMenuItem contract={contract} />
        ) : null}
        {contract.contractType === TokenType.ERC20 ? <Erc20TokenSnapshotMenuItem contract={contract} /> : null}
        {contract.contractType === TokenType.ERC721 ? <RoyaltyMenuItem contract={contract} /> : null}
        {contract.contractType === TokenType.ERC998 ? <RoyaltyMenuItem contract={contract} /> : null}
        {contract.contractType === TokenType.ERC1155 ? <RoyaltyMenuItem contract={contract} /> : null}

        {contract.contractFeatures.includes(ContractFeatures.BLACKLIST) ? (
          <BlacklistMenuItem contract={contract} />
        ) : null}
        {contract.contractFeatures.includes(ContractFeatures.BLACKLIST) ? (
          <UnBlacklistMenuItem contract={contract} />
        ) : null}
        {contract.contractFeatures.includes(ContractFeatures.WHITELIST) ? (
          <WhitelistMenuItem contract={contract} />
        ) : null}
        {contract.contractFeatures.includes(ContractFeatures.WHITELIST) ? (
          <UnWhitelistMenuItem contract={contract} />
        ) : null}

        <AllowanceMenuItem contract={contract} />
        {!contract.contractFeatures.includes(ContractFeatures.SOULBOUND) ? (
          <TransferMenuItem contract={contract} />
        ) : null}

        <EthListenerAddMenuItem contract={contract} />
        <EthListenerRemoveMenuItem contract={contract} />
      </Menu>
    </Fragment>
  );
};
