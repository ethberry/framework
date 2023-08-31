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
    Asset[] memory items, // items to get
    Asset memory price, // item to dismantle
    bytes calldata signature
  ) external payable whenNotPaused {
    if (!_hasRole(MINTER_ROLE, _recoverManyToManySignature(params, items, ExchangeUtils._toArray(price), signature))) {
      revert SignerMissingRole();
    }

    // burn (721, 998, 1155) or send price to receiver
    ExchangeUtils.burnFrom(ExchangeUtils._toArray(price), _msgSender(), params.receiver, DisabledTokenTypes(true, true, false, false, false));
    // send items to sender from receiver
    ExchangeUtils.acquireFrom(items, params.receiver, _msgSender(), DisabledTokenTypes(true, false, false, false, false));

    emit Dismantle(_msgSender(), params.externalId, items, ExchangeUtils._toArray(price));
  }
}
