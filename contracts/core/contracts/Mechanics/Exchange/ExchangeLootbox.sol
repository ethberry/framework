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

abstract contract ExchangeLootbox is SignatureValidator, ExchangeUtils, AccessControl, Pausable {
  event Lootbox(address from, Asset item, Asset[] ingredients);

  function lootbox(
    bytes32 nonce,
    Asset memory item,
    Asset[] memory ingredients,
    address signer,
    bytes calldata signature
  ) external payable {
    require(hasRole(MINTER_ROLE, signer), "Exchange: Wrong signer");
    _verifyOneToManySignature(nonce, item, ingredients, signer, signature);

    address account = _msgSender();

    spend(ingredients);

    emit Lootbox(account, item, ingredients);

    IERC721Lootbox(item.token).mintLootbox(account, item);
  }
}
