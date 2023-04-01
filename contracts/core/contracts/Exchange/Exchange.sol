// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

import "@gemunion/contracts-erc1363/contracts/extensions/ERC1363Receiver.sol";
import "@gemunion/contracts-mocks/contracts/Wallet.sol";

import "../utils/constants.sol";
import "./ExchangeCore.sol";
import "./ExchangeCraft.sol";
import "./ExchangeGrade.sol";
import "./ExchangeBreed.sol";
import "./ExchangeMysterybox.sol";
import "./ExchangeClaim.sol";
import "./ExchangeRentable.sol";
import "./referral/LinearReferral.sol";

contract Exchange is
  ExchangeCore,
  ExchangeCraft,
  ExchangeGrade,
  ExchangeBreed,
  ExchangeMysterybox,
  ExchangeClaim,
  LinearReferral,
  PaymentSplitter,
  ExchangeRentable,
  Wallet
{
  constructor(
    string memory name,
    address[] memory payees,
    uint256[] memory shares
  ) SignatureValidator(name) PaymentSplitter(payees, shares) {
    address account = _msgSender();
    _setupRole(DEFAULT_ADMIN_ROLE, account);
    _setupRole(MINTER_ROLE, account);
    _setupRole(PAUSER_ROLE, account);
    _setupRole(METADATA_ROLE, account);
  }

  function pause() public virtual onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public virtual onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, Wallet) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  /**
   * @dev Rejects any incoming ETH transfers to this contract address
   */
  receive() external payable override(PaymentSplitter, Wallet) {
    revert();
  }

  function _afterPurchase(
    address referrer,
    Asset[] memory price
  ) internal override(ExchangeCore, ExchangeMysterybox, LinearReferral) {
    return super._afterPurchase(referrer, price);
  }
}
