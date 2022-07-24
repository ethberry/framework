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
  event Lootbox(address from, uint256 externalId, Asset item, Asset[] ingredients);

  function lootbox(
    Params memory params,
    Asset memory item,
    Asset[] memory ingredients,
    address signer,
    bytes calldata signature
  ) external payable {
    require(hasRole(MINTER_ROLE, signer), "Exchange: Wrong signer");
    _verifyOneToManySignature(params, item, ingredients, signer, signature);

    address account = _msgSender();

    spend(ingredients, account);

    emit Lootbox(account, params.externalId, item, ingredients);

    IERC721Lootbox(item.token).mintLootbox(account, item);
  }
}
