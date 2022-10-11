// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./SignatureValidator.sol";
import "./ExchangeUtils.sol";
import "./interfaces/IAsset.sol";
import "../../ERC721/interfaces/IERC721Upgradeable.sol";

abstract contract ExchangeBreed is SignatureValidator, ExchangeUtils, AccessControl, Pausable {

  uint64 public _pregnancyTimeLimitMother = 0;
  uint64 public _pregnancyTimeLimitFather = 0;
  uint64 public _pregnancyCountLimitMother = 0;
  uint64 public _pregnancyCountLimitFather = 0;

  struct Pregnancy {
    uint256 timestamp;
    uint64 count;
  }

  mapping(address /* parent's contract */ => mapping(uint256 /* parent's tokenId */ => Pregnancy)) private _breeds;

  event Breed(address from, uint256 externalId, Asset mother, Asset father);

  function breed(
    Params memory params,
    Asset memory item,
    Asset memory price,
    address signer,
    bytes calldata signature
  ) external payable {
    require(hasRole(MINTER_ROLE, signer), "Exchange: Wrong signer");
    _verifyOneToOneSignature(params, item, price, signer, signature);

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

  function pregnancyCheckup(Asset memory mother, Asset memory father) internal {
    Pregnancy storage _pregnancyMother = _breeds[mother.token][mother.tokenId];
    Pregnancy storage _pregnancyFather = _breeds[father.token][father.tokenId];

    // Check pregnancy count
    if (_pregnancyCountLimitMother > 0) {
      require(_pregnancyMother.count < _pregnancyCountLimitMother, "Exchange: pregnancy count exceeded mother");
    }
    if (_pregnancyCountLimitFather > 0) {
      require(_pregnancyFather.count < _pregnancyCountLimitFather, "Exchange: pregnancy count exceeded father");
    }

    // Check pregnancy time
    uint64 breedTime = uint64(block.timestamp);

    require(breedTime - _pregnancyMother.timestamp > _pregnancyTimeLimitMother, "Exchange: pregnancy time limit mother");
    require(breedTime - _pregnancyFather.timestamp > _pregnancyTimeLimitFather, "Exchange: pregnancy time limit father");

    // Update Pregnancy
    _pregnancyMother.count += 1;
    _pregnancyFather.count += 1;

    _pregnancyMother.timestamp = breedTime;
    _pregnancyFather.timestamp = breedTime;
  }

  function setPregnancyLimits(uint64 countMother, uint64 countFather, uint64 timeMother, uint64 timeFather) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _pregnancyCountLimitMother = countMother;
    _pregnancyCountLimitFather = countFather;

    _pregnancyTimeLimitMother = timeMother;
    _pregnancyTimeLimitFather = timeFather;
  }
}
