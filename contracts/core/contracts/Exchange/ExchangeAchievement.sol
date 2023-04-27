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

abstract contract ExchangeAchievement is SignatureValidator, ExchangeUtils, AccessControl, Pausable {
  event AchievementClaimed(address account, uint256 externalId, Asset[] items);

  function achieve(
    Params memory params,
    Asset[] memory items,
    bytes calldata signature
  ) external payable whenNotPaused {
    address signer = _recoverManyToManySignature(params, items, new Asset[](0), signature);
    require(hasRole(MINTER_ROLE, signer), "Exchange: Wrong signer");

    address account = _msgSender();

    acquire(items, account, _disabledTypes);

    emit AchievementClaimed(account, params.externalId, items);
  }
}
