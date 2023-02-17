// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";

import "./ERC998Upgradeable.sol";
import "../ERC721/interfaces/IERC721Random.sol";
import "../Mechanics/Rarity/Rarity.sol";

abstract contract ERC998UpgradeableRandom is IERC721Random, ERC998Upgradeable, Rarity {
  using Counters for Counters.Counter;

  struct Request {
    address account;
    uint256 templateId;
  }

  mapping(bytes32 => Request) internal _queue;

  bytes4 private constant IERC721_RANDOM_ID = 0x32034d27;

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC998Upgradeable(name, symbol, royalty, baseTokenURI) {}

  function mintCommon(address account, uint256 templateId) external override(ERC998Upgradeable) onlyRole(MINTER_ROLE) {
    if (templateId == 0) {
      revert TemplateZero();
    }

    uint256 tokenId = _tokenIdTracker.current();
    _tokenIdTracker.increment();

    _upsertRecordField(tokenId, TEMPLATE_ID, templateId);
    _upsertRecordField(tokenId, GRADE, 0);
    _upsertRecordField(tokenId, RARITY, 0);

    _safeMint(account, tokenId);
  }

  function mintRandom(address account, uint256 templateId) external override onlyRole(MINTER_ROLE) {
    if (templateId == 0) {
      revert TemplateZero();
    }

    _queue[getRandomNumber()] = Request(account, templateId);
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal virtual {
    Request memory request = _queue[requestId];
    uint256 tokenId = _tokenIdTracker.current();

    emit MintRandom(requestId, request.account, randomness, request.templateId, tokenId);

    _upsertRecordField(tokenId, TEMPLATE_ID, request.templateId);
    _upsertRecordField(tokenId, GRADE, 0);
    _upsertRecordField(tokenId, RARITY, _getDispersion(randomness));

    delete _queue[requestId];
    _mintCommon(request.account, request.templateId);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return interfaceId == IERC721_RANDOM_ID || super.supportsInterface(interfaceId);
  }

  function getRandomNumber() internal virtual returns (bytes32 requestId);
}
