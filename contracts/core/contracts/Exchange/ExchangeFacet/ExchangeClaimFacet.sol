// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import "@gemunion/contracts-utils/contracts/roles.sol";

import "../../Diamond/override/AccessControlInternal.sol";
import "../../Diamond/override/PausableInternal.sol";
import "../../Exchange/lib/ExchangeUtils.sol";
import "../override/SignatureValidator.sol";

contract ExchangeClaimFacet is SignatureValidator, AccessControlInternal, PausableInternal {
  event Claim(address account, uint256 externalId, Asset[] items);

  constructor() SignatureValidator() {}

  function claim(Params memory params, Asset[] memory items, bytes calldata signature) external payable whenNotPaused {
    if (!_hasRole(MINTER_ROLE, _recoverManyToManySignature(params, items, new Asset[](0), signature))) {
      revert SignerMissingRole();
    }

    if (uint256(params.extra) != 0) {
      if (block.timestamp > uint256(params.extra)) {
        revert ExpiredSignature();
      }
    }

    ExchangeUtils.acquireFrom(items, params.receiver, _msgSender(), DisabledTokenTypes(false, false, false, false, false));

    emit Claim(_msgSender(), params.externalId, items);
  }
}
