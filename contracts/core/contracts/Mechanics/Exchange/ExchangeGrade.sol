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

abstract contract ExchangeGrade is SignatureValidator, ExchangeUtils, AccessControl, Pausable {
  event Upgrade(address from, Asset[] items, Asset[] ingredients);

  function upgrade(
    bytes32 nonce,
    Asset[] memory items,
    Asset[] memory ingredients,
    address signer,
    bytes calldata signature
  ) external payable {
    require(hasRole(MINTER_ROLE, signer), "Exchange: Wrong signer");
    _verifySignature(nonce, items, ingredients, signer, signature);

    require(items.length != 0, "Exchange: No item");

    address account = _msgSender();

    spend(ingredients);

    emit Upgrade(account, items, ingredients);

    Asset memory item = items[0];

    IERC721Graded(item.token).upgrade(item.tokenId);
  }
}
