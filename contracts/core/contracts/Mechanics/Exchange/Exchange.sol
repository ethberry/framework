// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

import "./ExchangeCore.sol";
import "./ExchangeCraft.sol";
import "./ExchangeGrade.sol";
import "./ExchangeBreed.sol";
import "./ExchangeMysterybox.sol";
import "./ExchangeClaim.sol";
import "./referral/LinearReferral.sol";

contract Exchange is
  ExchangeCore,
  ExchangeCraft,
  ExchangeGrade,
  ExchangeBreed,
  ExchangeMysterybox,
  ExchangeClaim,
  LinearReferral,
  ERC1155Holder,
  PaymentSplitter
{
  using Address for address;

  // bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  constructor(string memory name, address[] memory payees, uint256[] memory shares) SignatureValidator(name) PaymentSplitter(payees, shares) {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(MINTER_ROLE, _msgSender());
    _setupRole(PAUSER_ROLE, _msgSender());
  }

  function pause() public virtual onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public virtual onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(AccessControl, ERC1155Receiver)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  function _afterPurchase(address referrer, Asset[] memory price) internal override(ExchangeCore, ExchangeMysterybox, LinearReferral) {
    return super._afterPurchase(referrer, price);
  }
}
