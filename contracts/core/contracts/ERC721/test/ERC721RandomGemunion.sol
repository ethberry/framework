// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

import "../ERC721Upgradeable.sol";
import "../interfaces/IERC721Random.sol";
import "../../MOCKS/ChainLink/ChainLinkGemunionTest.sol";
import "../../Mechanics/Rarity/Rarity.sol";

contract ERC721RandomGemunion is IERC721Random, ChainLinkGemunionTest, ERC721Upgradeable, Rarity {
  using Counters for Counters.Counter;

  struct Request {
    address account;
    uint256 templateId;
  }

  mapping(bytes32 => Request) internal _queue;

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721Upgradeable(name, symbol, royalty, baseTokenURI) {}

  function mintCommon(address to, uint256 templateId) public override(ERC721Upgradeable) onlyRole(MINTER_ROLE) {
    require(templateId != 0, "ERC721RandomHardhat: wrong type");

    uint256 tokenId = _tokenIdTracker.current();
    _tokenIdTracker.increment();

    _upsertRecordField(tokenId, TEMPLATE_ID, templateId);
    _upsertRecordField(tokenId, GRADE, 1);
    _upsertRecordField(tokenId, RARITY, 1);

    _safeMint(to, tokenId);
  }

  function mintRandom(address account, uint256 templateId) external override onlyRole(MINTER_ROLE) {
    require(templateId != 0, "ERC721Random: wrong type");
    _queue[getRandomNumber()] = Request(account, templateId);
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    uint256 tokenId = _tokenIdTracker.current();
    _tokenIdTracker.increment();
    uint256 rarity = _getDispersion(randomness);
    Request memory request = _queue[requestId];

    emit MintRandom(requestId, request.account, randomness, request.templateId, tokenId);

    _upsertRecordField(tokenId, TEMPLATE_ID, request.templateId);
    _upsertRecordField(tokenId, GRADE, 1);
    _upsertRecordField(tokenId, RARITY, rarity);

    delete _queue[requestId];
    _safeMint(request.account, tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return interfaceId == type(IERC721Random).interfaceId || super.supportsInterface(interfaceId);
  }
}
