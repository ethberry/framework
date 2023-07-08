// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";

import "./interfaces/IERC721Random.sol";
import "./ERC721BlacklistUpgradeableRentable.sol";
import "../Mechanics/Rarity/Rarity.sol";
import "../utils/constants.sol";

abstract contract ERC721BlacklistUpgradeableRentableRandom is
  IERC721Random,
  ERC721BlacklistUpgradeableRentable,
  Rarity
{
  using Counters for Counters.Counter;

  struct Request {
    address account;
    uint256 templateId;
  }

  mapping(uint256 => Request) internal _queue;

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721BlacklistUpgradeableRentable(name, symbol, royalty, baseTokenURI) {}

  function mintCommon(address account, uint256 templateId) public override onlyRole(MINTER_ROLE) {
    uint256 tokenId = _mintCommon(account, templateId);

    _upsertRecordField(tokenId, RARITY, 0);
  }

  function mintRandom(address account, uint256 templateId) external override onlyRole(MINTER_ROLE) {
    // check if receiver is blacklisted
    require(!_isBlacklisted(account), "Blacklist: receiver is blacklisted");

    if (templateId == 0) {
      revert TemplateZero();
    }

    _queue[getRandomNumber()] = Request(account, templateId);
  }

  function upgrade(uint256 tokenId, bytes32 attribute) public virtual override onlyRole(METADATA_ROLE) returns (bool) {
    if (attribute == TEMPLATE_ID || attribute == RARITY) {
      revert ProtectedAttribute(attribute);
    }
    return _upgrade(tokenId, attribute);
  }

  function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal virtual {
    Request memory request = _queue[requestId];

    uint256 tokenId = _tokenIdTracker.current();

    emit MintRandom(requestId, request.account, randomWords[0], request.templateId, tokenId);

    _upsertRecordField(tokenId, RARITY, _getDispersion(randomWords[0]));

    delete _queue[requestId];

    _mintCommon(request.account, request.templateId);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return interfaceId == IERC721_RANDOM_ID || super.supportsInterface(interfaceId);
  }

  function getRandomNumber() internal virtual returns (uint256 requestId);
}
