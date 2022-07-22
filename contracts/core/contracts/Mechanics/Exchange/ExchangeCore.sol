// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "./SignatureValidator.sol";
import "./ExchangeUtils.sol";
import "../Asset/interfaces/IAsset.sol";

abstract contract ExchangeCore is SignatureValidator, ExchangeUtils, AccessControl, Pausable {
  event Purchase(address from, Asset[] items, Asset[] ingredients);

  function purchase(
    bytes32 nonce,
    Asset[] memory items,
    Asset[] memory ingredients,
    address signer,
    bytes calldata signature
  ) external payable whenNotPaused {
    require(hasRole(MINTER_ROLE, signer), "Exchange: Wrong signer");
    _verifySignature(nonce, items, ingredients, signer, signature);

    address account = _msgSender();

    spend(ingredients);
    acquire(items);

    emit Purchase(account, items, ingredients);
  }
}
