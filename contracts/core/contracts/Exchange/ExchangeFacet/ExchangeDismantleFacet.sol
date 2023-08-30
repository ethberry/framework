// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-misc/contracts/roles.sol";

import "../override/SignatureValidator.sol";
import "../../Diamond/override/AccessControlInternal.sol";
import "../../Diamond/override/PausableInternal.sol";
import "../../Exchange/lib/ExchangeUtils.sol";

contract ExchangeDismantleFacet is SignatureValidator, AccessControlInternal, PausableInternal {
  event Dismantle(address account, uint256 externalId, Asset[] items, Asset[] price);

  constructor() SignatureValidator() {}

  function dismantle(
    Params memory params,
    Asset[] memory items,
    Asset[] memory price,
    bytes calldata signature
  ) external payable whenNotPaused {
    if (!_hasRole(MINTER_ROLE, _recoverManyToManySignature(params, items, price, signature))) {
      revert SignerMissingRole();
    }

    // burn or send price to receiver
    ExchangeUtils.burnFrom(price, _msgSender(), params.receiver, DisabledTokenTypes(false, false, false, false, false));
    ExchangeUtils.acquireFrom(items, params.receiver, _msgSender(), DisabledTokenTypes(false, false, false, false, false));

    emit Dismantle(_msgSender(), params.externalId, items, price);
  }
}
