// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./SignatureValidator.sol";
import "./ExchangeUtils.sol";
import "./interfaces/IAsset.sol";
import "../ERC721/interfaces/IERC721Upgradeable.sol";

abstract contract ExchangeBreed is SignatureValidator, ExchangeUtils, AccessControl, Pausable {
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
  ) external payable {
    address signer = _recoverOneToOneSignature(params, item, price, signature);
    require(hasRole(MINTER_ROLE, signer), "Exchange: Wrong signer");

    address account = _msgSender();

    // TODO approved
    address ownerOf1 = IERC721(item.token).ownerOf(item.tokenId);
    require(ownerOf1 == account, "Exchange: Not an owner");

    address ownerOf2 = IERC721(price.token).ownerOf(price.tokenId);
    require(ownerOf2 == account, "Exchange: Not an owner");

    pregnancyCheckup(item, price);

    emit Breed(account, params.externalId, item, price);

    IERC721Random(item.token).mintRandom(account, params.externalId);
  }

  function pregnancyCheckup(Asset memory matron, Asset memory sire) internal {
    Pregnancy storage pregnancyM = _breeds[matron.token][matron.tokenId];
    Pregnancy storage pregnancyS = _breeds[sire.token][sire.tokenId];

    // Check pregnancy count
    if (_pregnancyCountLimit > 0) {
      require(pregnancyM.count < _pregnancyCountLimit, "Exchange: pregnancy count exceeded");
      require(pregnancyS.count < _pregnancyCountLimit, "Exchange: pregnancy count exceeded");
    }

    // Check pregnancy time
    uint64 timeNow = uint64(block.timestamp);

    require(pregnancyM.count <= 4294967295 && pregnancyS.count <= 4294967295); // just in case

    uint64 timeLimitM = pregnancyM.count > 13
      ? _pregnancyMaxTime
      : uint64(_pregnancyTimeLimit * (2 ** pregnancyM.count));
    uint64 timeLimitS = pregnancyS.count > 13
      ? _pregnancyMaxTime
      : uint64(_pregnancyTimeLimit * (2 ** pregnancyS.count));

    if (pregnancyM.count > 0 || pregnancyS.count > 0) {
      require(timeNow - pregnancyM.time > timeLimitM, "Exchange: pregnancy time limit");
      require(timeNow - pregnancyS.time > timeLimitS, "Exchange: pregnancy time limit");
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
