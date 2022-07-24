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

abstract contract ExchangeCore is SignatureValidator, ExchangeUtils, AccessControl, Pausable {
  event Purchase(address from, uint256 externalId, Asset item, Asset[] ingredients);

  function purchase(
    Params memory params,
    Asset memory item,
    Asset[] memory ingredients,
    address signer,
    bytes calldata signature
  ) external payable whenNotPaused {
    require(hasRole(MINTER_ROLE, signer), "Exchange: Wrong signer");
    _verifyOneToManySignature(params, item, ingredients, signer, signature);

    address account = _msgSender();

    spend(ingredients, account);
    acquire(toArray(item), account);

    emit Purchase(account, params.externalId, item, ingredients);
  }
}
