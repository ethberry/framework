// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

import "@gemunion/contracts/contracts/ERC721/ChainLink/ERC721ChainLinkBinance.sol";

import "./ERC721Simple.sol";
import "./interfaces/IERC721Random.sol";

contract ERC721Random is IERC721Random, ERC721ChainLinkBinance, ERC721Simple {
  using Counters for Counters.Counter;

  struct Request {
    address account;
    uint256 templateId;
  }

  mapping(bytes32 => Request) internal _queue;

  event MintRandom(bytes32 requestId, address to, uint256 randomness, uint256 templateId, uint256 tokenId);

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721Simple(name, symbol, royalty, baseTokenURI) {}

  function mintCommon(address to, uint256 templateId)
    public
    override(ERC721Simple)
    onlyRole(MINTER_ROLE)
  {
    require(templateId != 0, "ERC721: wrong type");

    uint256 tokenId = _tokenIdTracker.current();
    _tokenIdTracker.increment();

    upsertRecordField(tokenId, TEMPLATE_ID, templateId);
    upsertRecordField(tokenId, RARITY, 1);

    _safeMint(to, tokenId);
  }

  function mintRandom(address to, uint256 templateId) external override onlyRole(MINTER_ROLE) {
    require(templateId != 0, "ERC721: wrong type");
    _queue[getRandomNumber()] = Request(to, templateId);
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    uint256 tokenId = _tokenIdTracker.current();
    _tokenIdTracker.increment();
    uint256 rarity = _getDispersion(randomness);
    Request memory request = _queue[requestId];

    emit MintRandom(requestId, request.account, randomness, request.templateId, tokenId);

    upsertRecordField(tokenId, TEMPLATE_ID, request.templateId);
    upsertRecordField(tokenId, RARITY, rarity);

    delete _queue[requestId];
    _safeMint(request.account, tokenId);
  }

  function _getDispersion(uint256 randomness) internal pure virtual returns (uint256) {
    uint256 percent = (randomness % 100) + 1;
    if (percent < 1) {
      return 5;
    } else if (percent < 1 + 3) {
      return 4;
    } else if (percent < 1 + 3 + 8) {
      return 3;
    } else if (percent < 1 + 3 + 8 + 20) {
      return 2;
    }

    // common
    return 1;
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return interfaceId == type(IERC721Random).interfaceId || super.supportsInterface(interfaceId);
  }
}
