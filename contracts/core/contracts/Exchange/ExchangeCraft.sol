// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "./SignatureValidator.sol";
import "./ExchangeUtils.sol";
import "./interfaces/IAsset.sol";

abstract contract ExchangeCraft is SignatureValidator, AccessControl, Pausable {
  event Craft(address from, uint256 externalId, Asset[] items, Asset[] price);

  function craft(
    Params memory params,
    Asset[] memory items,
    Asset[] memory price,
    bytes calldata signature
  ) external payable whenNotPaused {
    address signer = _recoverManyToManySignature(params, items, price, signature);
    if (!hasRole(MINTER_ROLE, signer)) revert SignerMissingRole();

    address account = _msgSender();

    ExchangeUtils.spendFrom(price, account, address(this), DisabledTokenTypes(false, false, false, false, false));
    ExchangeUtils.acquire(items, account, DisabledTokenTypes(false, false, false, false, false));

    emit Craft(account, params.externalId, items, price);
  }
}
