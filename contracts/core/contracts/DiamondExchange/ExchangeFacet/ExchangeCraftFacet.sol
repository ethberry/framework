// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "../override/SignatureValidator.sol";
import "../../Diamond/override/AccessControlInternal.sol";
import "../../Diamond/override/PausableInternal.sol";
import "../../Exchange/ExchangeUtils.sol";

contract ExchangeCraftFacet is SignatureValidator, AccessControlInternal, PausableInternal {
  event Craft(address from, uint256 externalId, Asset[] items, Asset[] price);

  constructor() SignatureValidator() {}

  function craft(
    Params memory params,
    Asset[] memory items,
    Asset[] memory price,
    bytes calldata signature
  ) external payable whenNotPaused {
    if (!_hasRole(MINTER_ROLE, _recoverManyToManySignature(params, items, price, signature))) {
      revert SignerMissingRole();
    }

    ExchangeUtils.spendFrom(price, _msgSender(), address(this), DisabledTokenTypes(false, false, false, false, false));
    ExchangeUtils.acquireFrom(items, params.receiver, _msgSender(), DisabledTokenTypes(false, false, false, false, false));

    emit Craft(_msgSender(), params.externalId, items, price);
  }
}
