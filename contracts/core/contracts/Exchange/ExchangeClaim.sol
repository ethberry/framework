// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "./SignatureValidator.sol";
import "./ExchangeUtils.sol";
import "./interfaces/IAsset.sol";

abstract contract ExchangeClaim is SignatureValidator, AccessControl, Pausable {
  event Claim(address from, uint256 externalId, Asset[] items);

  function claim(Params memory params, Asset[] memory items, bytes calldata signature) external payable whenNotPaused {
    if (!hasRole(MINTER_ROLE, _recoverManyToManySignature(params, items, new Asset[](0), signature))) {
      revert SignerMissingRole();
    }

    if (block.timestamp > uint256(params.extra)) {
      revert ExpiredSignature();
    }

    ExchangeUtils.acquire(items, _msgSender(), DisabledTokenTypes(false, false, false, false, false));

    emit Claim(_msgSender(), params.externalId, items);
  }
}
