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

  uint64 public _pregnancyTimeLimit = 0;
  uint64 public _pregnancyCountLimit = 0;

  struct Pregnancy {
    uint256 timestamp;
    uint64 count;
  }

  mapping(address => mapping(uint256 => Pregnancy)) private _breeds;

  event Breed(address from, uint256 externalId, Asset item, Asset price);

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
    require(ownerOf1 == account, "Exchange: Wrong signer");

    address ownerOf2 = IERC721(price.token).ownerOf(item.tokenId);
    require(ownerOf2 == account, "Exchange: Wrong signer");

    pregnancyCheckup(item, price);

    emit Breed(account, params.externalId, item, price);

    IERC721Random(item.token).mintRandom(account, params.externalId);
  }

  function pregnancyCheckup(Asset memory item, Asset memory price) internal {
    // Check pregnancy count
    uint64 breedCountItem = _breeds[item.token][item.tokenId].count;
    uint64 breedCountPrice = _breeds[price.token][price.tokenId].count;

    require(breedCountItem >= _pregnancyCountLimit, "Exchange: pregnancy count exceeded item");
    require(breedCountPrice >= _pregnancyCountLimit, "Exchange: pregnancy count exceeded price");

    // Check pregnancy time
    uint64 breedTime = uint64(block.timestamp);

    uint256 breedTimeItem = _breeds[item.token][item.tokenId].timestamp;
    uint256 breedTimePrice = _breeds[price.token][price.tokenId].timestamp;

    require(breedTime - breedTimeItem > _pregnancyTimeLimit, "Exchange: pregnancy time limit item");
    require(breedTime - breedTimePrice > _pregnancyTimeLimit, "Exchange: pregnancy time limit price");

    // Update Pregnancy
    _breeds[item.token][item.tokenId].count += 1;
    _breeds[price.token][price.tokenId].count += 1;

    _breeds[item.token][item.tokenId].timestamp = breedTime;
    _breeds[price.token][price.tokenId].timestamp = breedTime;
  }

  function setPregnancyLimits(uint64 timeLimit, uint64 countLimit) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _pregnancyTimeLimit = timeLimit;
    _pregnancyCountLimit = countLimit;
  }
}
