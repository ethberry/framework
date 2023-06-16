// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./SignatureValidator.sol";
import "./ExchangeUtils.sol";
import "./interfaces/IAsset.sol";

abstract contract ExchangeBreed is SignatureValidator, AccessControl, Pausable {
  using SafeCast for uint256;

  uint64 public _pregnancyTimeLimit = 0; // first pregnancy(cooldown) time
  uint64 public _pregnancyCountLimit = 0;
  uint64 public _pregnancyMaxTime = 0;

  struct Pregnancy {
    uint64 time; // last breeding timestamp
    uint64 count; // breeds count
  }

  mapping(address /* item's contract */ => mapping(uint256 /* item's tokenId */ => Pregnancy)) private _breeds;

  event Breed(address from, uint256 externalId, Asset matron, Asset sire);

  function breed(
    Params memory params,
    Asset memory item,
    Asset memory price,
    bytes calldata signature
  ) external payable whenNotPaused {
    if (!hasRole(MINTER_ROLE, _recoverOneToOneSignature(params, item, price, signature))) {
      revert SignerMissingRole();
    }

    // TODO OR approved?
    if (IERC721(item.token).ownerOf(item.tokenId) != _msgSender()) {
      revert NotAnOwner();
    }

    if (IERC721(price.token).ownerOf(price.tokenId) != _msgSender()) {
      revert NotAnOwner();
    }

    pregnancyCheckup(item, price);

    emit Breed(_msgSender(), params.externalId, item, price);

    IERC721Random(item.token).mintRandom(_msgSender(), params.externalId);
  }

  function pregnancyCheckup(Asset memory matron, Asset memory sire) internal {
    Pregnancy storage pregnancyM = _breeds[matron.token][matron.tokenId];
    Pregnancy storage pregnancyS = _breeds[sire.token][sire.tokenId];

    // Check pregnancy count
    if (_pregnancyCountLimit > 0) {
      if (pregnancyM.count >= _pregnancyCountLimit) {
        revert CountExceed();
      }
      if (pregnancyS.count >= _pregnancyCountLimit) {
        revert CountExceed();
      }
    }

    // Check pregnancy time
    uint64 timeNow = block.timestamp.toUint64();

    // TODO set rules?
    if (pregnancyM.count > 0 || pregnancyS.count > 0) {
      if (
        timeNow - pregnancyM.time <=
        (pregnancyM.count > 13 ? _pregnancyMaxTime : (_pregnancyTimeLimit * (2 ** pregnancyM.count)).toUint64())
      ) {
        revert LimitExceed();
      }
      if (
        timeNow - pregnancyS.time <=
        (pregnancyS.count > 13 ? _pregnancyMaxTime : (_pregnancyTimeLimit * (2 ** pregnancyS.count)).toUint64())
      ) {
        revert LimitExceed();
      }
    }

    // Update Pregnancy
    pregnancyM.count += 1;
    pregnancyM.time = timeNow;
    pregnancyS.count += 1;
    pregnancyS.time = timeNow;
  }

  function setPregnancyLimits(uint64 count, uint64 time, uint64 maxTime) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _pregnancyCountLimit = count;
    _pregnancyTimeLimit = time;
    _pregnancyMaxTime = maxTime;
  }
}
