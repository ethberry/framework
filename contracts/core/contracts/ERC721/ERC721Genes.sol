// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

import "@gemunion/contracts/contracts/ERC721/ChainLink/ERC721ChainLinkBinance.sol";

import "./ERC721Simple.sol";
import "./interfaces/IERC721Random.sol";
import "../Mechanics/Breed/Breed.sol";

contract ERC721Genes is IERC721Random, ERC721ChainLinkBinance, ERC721Simple, Breed {
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
  ) ERC721Simple(name, symbol, royalty, baseTokenURI) {}

  function mintCommon(address, uint256) external virtual override onlyRole(MINTER_ROLE) {
    revert MethodNotSupported();
  }

  function mintRandom(address account, uint256 templateId) external override onlyRole(MINTER_ROLE) {
    require(templateId != 0, "ERC721: wrong type");
    _queue[getRandomNumber()] = Request(account, templateId);
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    uint256 tokenId = _tokenIdTracker.current();
    _tokenIdTracker.increment();
    Request memory request = _queue[requestId];

    emit MintRandom(requestId, request.account, randomness, request.templateId, tokenId);

    upsertRecordField(tokenId, TEMPLATE_ID, request.templateId);
    upsertRecordField(tokenId, GENES, randomness);

    delete _queue[requestId];
    _safeMint(request.account, tokenId);
  }
}
