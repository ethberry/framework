// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "./SignatureValidator.sol";
import "./ExchangeUtils.sol";
import "./interfaces/IAsset.sol";

abstract contract ExchangeCraft is SignatureValidator, ExchangeUtils, AccessControl, Pausable {
  event Craft(address from, uint256 externalId, Asset[] items, Asset[] ingredients);

  function craft(
    Params memory params,
    Asset[] memory items,
    Asset[] memory ingredients,
    address signer,
    bytes calldata signature
  ) external payable whenNotPaused {
    require(hasRole(MINTER_ROLE, signer), "Exchange: Wrong signer");
    _verifyManyToManySignature(params, items, ingredients, signer, signature);

    address account = _msgSender();

    spend(ingredients, account);
    acquire(items, account);

    emit Craft(account, params.externalId, items, ingredients);
  }
}
