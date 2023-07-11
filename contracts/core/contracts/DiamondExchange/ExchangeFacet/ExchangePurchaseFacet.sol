// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

// import "@openzeppelin/contracts/access/AccessControl.sol";
// import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import "../override/SignatureValidator.sol";
import "../../Diamond/override/AccessControlInternal.sol";
import "../../Diamond/override/PausableInternal.sol";
import "../../Exchange/ExchangeUtils.sol";

//import "../../Exchange/interfaces/IAsset.sol";

contract ExchangePurchaseFacet is SignatureValidator, AccessControlInternal, PausableInternal {
  event Purchase(address from, uint256 externalId, Asset item, Asset[] price);

  constructor() SignatureValidator() {}

  function purchase(
    Params memory params,
    Asset memory item,
    Asset[] memory price,
    bytes calldata signature
  ) external payable whenNotPaused {
    address signer = _recoverOneToManySignature(params, item, price, signature);
    if (!_hasRole(MINTER_ROLE, signer)) {
      revert SignerMissingRole();
    }

    ExchangeUtils.spendFrom(price, _msgSender(), address(this), DisabledTokenTypes(false, false, false, false, false));

    ExchangeUtils.acquire(
      ExchangeUtils._toArray(item),
      _msgSender(),
      DisabledTokenTypes(false, false, false, false, false)
    );

    emit Purchase(_msgSender(), params.externalId, item, price);

    // _afterPurchase(params.referrer, price);
  }
}