import { FC, Fragment, MouseEvent, useState } from "react";
import { IconButton, Menu } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

import { ContractFeatures, IContract, ModuleType, TokenType } from "@framework/types";

import { Erc20TokenSnapshotMenuItem } from "./snapshot";
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
import { StakesMenuItem } from "./max-stakes";
import { CollectionUploadMenuItem } from "./collection/upload";
import { FundEthMenuItem } from "./fund-eth";
import { AllowanceMenu } from "./allowance";
import { WhitelistAddMenuItem } from "./whitelist-add";
import { UnWhitelistMenuItem } from "./whitelist-remove";
import { TransferMenuItem } from "./transfer";

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
        {contract.contractType !== TokenType.NATIVE && contract.contractModule === ModuleType.HIERARCHY ? (
          <MintMenuItem contract={contract} />
        ) : null}
        {contract.contractType === TokenType.ERC20 ? <Erc20TokenSnapshotMenuItem contract={contract} /> : null}
        {contract.contractType === TokenType.ERC721 &&
        !contract.contractFeatures.includes(ContractFeatures.SOULBOUND) ? (
          <RoyaltyMenuItem contract={contract} />
        ) : null}
        {contract.contractType === TokenType.ERC998 ? <RoyaltyMenuItem contract={contract} /> : null}
        {contract.contractType === TokenType.ERC1155 &&
        !contract.contractFeatures.includes(ContractFeatures.SOULBOUND) ? (
          <RoyaltyMenuItem contract={contract} />
        ) : null}

        <ContractGrantRoleMenuItem contract={contract} />
        <ContractRevokeRoleMenuItem contract={contract} />
        <ContractRenounceRoleMenuItem contract={contract} />

        {contract.contractFeatures.includes(ContractFeatures.BLACKLIST) ? (
          <BlacklistAddMenuItem contract={contract} />
        ) : null}
        {contract.contractFeatures.includes(ContractFeatures.BLACKLIST) ? (
          <UnBlacklistMenuItem contract={contract} />
        ) : null}
        {contract.contractFeatures.includes(ContractFeatures.WHITELIST) ? (
          <WhitelistAddMenuItem contract={contract} />
        ) : null}
        {contract.contractFeatures.includes(ContractFeatures.WHITELIST) ? (
          <UnWhitelistMenuItem contract={contract} />
        ) : null}
        {contract.contractFeatures.includes(ContractFeatures.PAUSABLE) ? (
          <PausableMenuItem contract={contract} />
        ) : null}
        {contract.contractType === TokenType.ERC20 ? <AllowanceMenu contract={contract} /> : null}
        {contract.contractType === TokenType.ERC721 ? <AllowanceMenu contract={contract} /> : null}
        {contract.contractType === TokenType.ERC998 ? <AllowanceMenu contract={contract} /> : null}
        {contract.contractType === TokenType.ERC1155 ? <AllowanceMenu contract={contract} /> : null}

        <TransferMenuItem contract={contract} />

        {contract.contractModule === ModuleType.PYRAMID ? <PyramidBalanceMenuItem contract={contract} /> : null}
        {contract.contractModule === ModuleType.PYRAMID ? <FundEthMenuItem contract={contract} /> : null}
        {contract.contractModule === ModuleType.STAKING ? <StakesMenuItem contract={contract} /> : null}
        {contract.contractModule === ModuleType.STAKING ? <FundEthMenuItem contract={contract} /> : null}
        {contract.contractModule === ModuleType.COLLECTION ? <CollectionUploadMenuItem contract={contract} /> : null}

        {contract.contractType !== TokenType.NATIVE ? <EthListenerAddMenuItem contract={contract} /> : null}
        {contract.contractType !== TokenType.NATIVE ? <EthListenerRemoveMenuItem contract={contract} /> : null}
      </Menu>
    </Fragment>
  );
};
