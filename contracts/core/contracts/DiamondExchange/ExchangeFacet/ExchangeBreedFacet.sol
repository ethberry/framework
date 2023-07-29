// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/math/SafeCast.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@gemunion/contracts-misc/contracts/constants.sol";

import "../../ERC721/interfaces/IERC721Random.sol";

import "../../Diamond/override/AccessControlInternal.sol";
import "../../Diamond/override/PausableInternal.sol";
import "../../utils/constants.sol";

import "../override/SignatureValidator.sol";
import "../storage/ExchangeStorage.sol";


contract ExchangeBreedFacet is SignatureValidator, AccessControlInternal, PausableInternal {
  event Breed(address from, uint256 externalId, Asset matron, Asset sire);

  using SafeCast for uint256;

  constructor() SignatureValidator() {}

  function breed(
    Params memory params,
    Asset memory item,
    Asset memory price,
    bytes calldata signature
  ) external payable whenNotPaused {
    if (!_hasRole(MINTER_ROLE, _recoverOneToOneSignature(params, item, price, signature))) {
      revert SignerMissingRole();
    }

    // TODO test approve
    if (IERC721(item.token).ownerOf(item.tokenId) != _msgSender()) {
      if (IERC721(item.token).getApproved(item.tokenId) != _msgSender()) {
        revert NotAnOwner();
      }
    }

    if (IERC721(price.token).ownerOf(price.tokenId) != _msgSender()) {
      if (IERC721(price.token).getApproved(price.tokenId) != _msgSender()) {
        revert NotAnOwner();
      }
    }

    pregnancyCheckup(item, price);

    emit Breed(_msgSender(), params.externalId, item, price);

    IERC721Random(item.token).mintRandom(_msgSender(), params.externalId);
  }

  function pregnancyCheckup(Asset memory matron, Asset memory sire) internal {
    ExchangeStorage.Pregnancy storage pregnancyM = ExchangeStorage.layout()._breeds[matron.token][matron.tokenId];
    ExchangeStorage.Pregnancy storage pregnancyS = ExchangeStorage.layout()._breeds[sire.token][sire.tokenId];

    // Check pregnancy count
    if (ExchangeStorage.layout()._pregnancyCountLimit > 0) {
      if (pregnancyM.count >= ExchangeStorage.layout()._pregnancyCountLimit) {
        revert CountExceed();
      }
      if (pregnancyS.count >= ExchangeStorage.layout()._pregnancyCountLimit) {
        revert CountExceed();
      }
    }

    // Check pregnancy time
    uint64 timeNow = block.timestamp.toUint64();

    // TODO set pregnancy rules?
    if (pregnancyM.count > 0 || pregnancyS.count > 0) {
      if (
        timeNow - pregnancyM.time <=
        (pregnancyM.count > 13 ? ExchangeStorage.layout()._pregnancyMaxTime : (ExchangeStorage.layout()._pregnancyTimeLimit * (2 ** pregnancyM.count)).toUint64())
      ) {
        revert LimitExceed();
      }
      if (
        timeNow - pregnancyS.time <=
        (pregnancyS.count > 13 ? ExchangeStorage.layout()._pregnancyMaxTime : (ExchangeStorage.layout()._pregnancyTimeLimit * (2 ** pregnancyS.count)).toUint64())
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
    ExchangeStorage.layout()._pregnancyCountLimit = count;
    ExchangeStorage.layout()._pregnancyTimeLimit = time;
    ExchangeStorage.layout()._pregnancyMaxTime = maxTime;
  }
}
