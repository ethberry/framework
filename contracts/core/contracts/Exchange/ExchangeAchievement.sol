// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@gemunion/contracts-erc721/contracts/interfaces/IERC4907.sol";

import "../Mechanics/Mysterybox/interfaces/IERC721Mysterybox.sol";
import "./SignatureValidator.sol";
import "./ExchangeUtils.sol";

abstract contract ExchangeAchievement is SignatureValidator, AccessControl, Pausable {
  event AchievementClaimed(address account, uint256 externalId, Asset[] items);

  function achieve(
    Params memory params,
    Asset[] memory items,
    bytes calldata signature
  ) external payable whenNotPaused {
    address signer = _recoverManyToManySignature(params, items, new Asset[](0), signature);
    if (!hasRole(MINTER_ROLE, signer)) {
      revert SignerMissingRole();
    }

    ExchangeUtils.acquire(items, _msgSender(), DisabledTokenTypes(false, false, false, false, false));

    emit AchievementClaimed(_msgSender(), params.externalId, items);
  }
}
