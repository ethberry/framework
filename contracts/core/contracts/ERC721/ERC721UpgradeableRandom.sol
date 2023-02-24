// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";

import "./interfaces/IERC721Random.sol";
import "./ERC721Upgradeable.sol";
import "../Mechanics/Rarity/Rarity.sol";
import "../utils/constants.sol";

abstract contract ERC721UpgradeableRandom is IERC721Random, ERC721Upgradeable, Rarity {
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
  ) ERC721Upgradeable(name, symbol, royalty, baseTokenURI) {}

  function mintCommon(address account, uint256 templateId) public override(ERC721Upgradeable) onlyRole(MINTER_ROLE) {
    uint256 tokenId = _mintCommon(account, templateId);

    _upsertRecordField(tokenId, GRADE, 0);
    _upsertRecordField(tokenId, RARITY, 0);
  }

  function mintRandom(address to, uint256 templateId) external override onlyRole(MINTER_ROLE) {
    if (templateId == 0) {
      revert TemplateZero();
    }

    _queue[getRandomNumber()] = Request(to, templateId);
  }

  function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal virtual {
    Request memory request = _queue[requestId];
    uint256 tokenId = _tokenIdTracker.current();

    emit MintRandom(requestId, request.account, randomWords[0], request.templateId, tokenId);

    _upsertRecordField(tokenId, GRADE, 0);
    _upsertRecordField(tokenId, RARITY, _getDispersion(randomWords[0]));

    delete _queue[requestId];
    _mintCommon(request.account, request.templateId);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return interfaceId == IERC721_RANDOM_ID || super.supportsInterface(interfaceId);
  }

  function getRandomNumber() internal virtual returns (uint256 requestId);
}
