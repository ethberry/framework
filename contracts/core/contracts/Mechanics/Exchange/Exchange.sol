// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

import "./ExchangeCore.sol";
import "./ExchangeCraft.sol";
import "./ExchangeGrade.sol";
import "./ExchangeMysterybox.sol";
import "./ExchangeClaim.sol";
import "./ExchangeReferral.sol";

contract Exchange is
  ExchangeCore,
  ExchangeCraft,
  ExchangeGrade,
  ExchangeMysterybox,
  ExchangeClaim,
  ExchangeReferral,
  ERC1155Holder
{
  using Address for address;

  // bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  constructor(string memory name) SignatureValidator(name) {
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

  function _afterPurchase(Params memory params) internal override(ExchangeCore, ExchangeMysterybox, ExchangeReferral) {
    return super._afterPurchase(params);
  }
}
