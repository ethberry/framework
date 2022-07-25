// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "../Lootbox/interfaces/IERC721Lootbox.sol";
import "./SignatureValidator.sol";
import "./ExchangeUtils.sol";

abstract contract ExchangeLootbox is SignatureValidator, ExchangeUtils, AccessControl, Pausable {
  event Lootbox(address from, uint256 externalId, Asset[] items, Asset[] ingredients);

  function lootbox(
    Params memory params,
    Asset[] memory items,
    Asset[] memory ingredients,
    address signer,
    bytes calldata signature
  ) external payable {
    require(hasRole(MINTER_ROLE, signer), "Exchange: Wrong signer");
    _verifyManyToManySignature(params, items, ingredients, signer, signature);

    require(items.length > 1, "Exchange: Wrong items count");

    address account = _msgSender();

    spend(ingredients, account);

    emit Lootbox(account, params.externalId, items, ingredients);

    Asset memory box = items[items.length - 1];
    delete items[items.length - 1];

    IERC721Lootbox(box.token).mintLootbox(account, box.tokenId, items);
  }
}
