// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;
//import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/Counters.sol";

import "@gemunion/contracts-chain-link/contracts/extensions/ChainLinkHardhat.sol";

import "../ERC721Simple.sol";
import "../interfaces/IERC721Random.sol";
import "../../Mechanics/Breed/Breed.sol";

contract ERC721GenesHardhat is IERC721Random, ChainLinkHardhat, ERC721Simple, Breed {
  using Counters for Counters.Counter;

  struct Request {
    address account;
    uint32 templateId;
    uint32 matronId;
    uint32 sireId;
  }

  mapping(bytes32 => Request) internal _queue;

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721Simple(name, symbol, royalty, baseTokenURI) {}

  function mintCommon(address to, uint256 templateId) external virtual override onlyRole(MINTER_ROLE) {
    //    revert MethodNotSupported();
    require(templateId != 0, "ERC721GenesHardhat: wrong type");

    uint256 tokenId = _tokenIdTracker.current();
    _tokenIdTracker.increment();

    _upsertRecordField(tokenId, TEMPLATE_ID, templateId);
    _upsertRecordField(tokenId, GRADE, 1);
    _upsertRecordField(tokenId, RARITY, 1);

    _safeMint(to, tokenId);
  }

  function mintRandom(address account, uint256 templateId) external override onlyRole(MINTER_ROLE) {
    require(templateId != 0, "ERC721: wrong type");

    (uint256 childId, uint256 matronId, uint256 sireId) = decodeData(templateId);

    _queue[getRandomNumber()] = Request(account, uint32(childId), uint32(matronId), uint32(sireId));
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    uint256 tokenId = _tokenIdTracker.current();
    _tokenIdTracker.increment();
    Request memory request = _queue[requestId];

    emit MintRandom(requestId, request.account, randomness, request.templateId, tokenId);

    _upsertRecordField(tokenId, TEMPLATE_ID, request.templateId);
    uint256 genes = encodeData(request, randomness);

    _upsertRecordField(tokenId, GENES, genes);

    delete _queue[requestId];
    _safeMint(request.account, tokenId);
  }

  function decodeData(uint256 externalId) internal pure returns (uint256 childId, uint256 matronId, uint256 sireId) {
    childId = uint256(uint32(externalId));
    matronId = uint256(uint32(externalId >> 32));
    sireId = uint256(uint32(externalId >> 64));
  }

  function encodeData(Request memory req, uint256 randomness) internal pure returns (uint256 genes) {
    genes = uint256(req.matronId);
    genes |= uint256(req.sireId) << 32;
    genes |= randomness << 64;
  }
}
