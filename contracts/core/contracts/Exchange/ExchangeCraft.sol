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

abstract contract ExchangeCraft is SignatureValidator, ExchangeUtils, AccessControl, Pausable {
  event Craft(address from, uint256 externalId, Asset[] items, Asset[] price);

  function craft(
    Params memory params,
    Asset[] memory items,
    Asset[] memory price,
    bytes calldata signature
  ) external payable whenNotPaused {
    address signer = _recoverManyToManySignature(params, items, price, signature);
    require(hasRole(MINTER_ROLE, signer), "Exchange: Wrong signer");

    address account = _msgSender();

    spendFrom(price, account, address(this), _disabledTypes);
    acquire(items, account);

    emit Craft(account, params.externalId, items, price);
  }
}
