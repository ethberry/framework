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
  event Upgrade(address from, Asset item, Asset[] ingredients);

  function upgrade(
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

    emit Upgrade(account, item, ingredients);

    IERC721Graded(item.token).upgrade(item.tokenId);
  }
}
