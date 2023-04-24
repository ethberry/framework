// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";

import "./ERC721Simple.sol";
import "./interfaces/IERC721Random.sol";
import "../Mechanics/Breed/Breed.sol";

import "../utils/constants.sol";

abstract contract ERC721Genes is IERC721Random, ERC721Simple, Breed {
  using Counters for Counters.Counter;
  using SafeCast for uint;

  struct Request {
    address account;
    uint32 templateId /* childId */;
    uint32 matronId;
    uint32 sireId;
  }

  mapping(uint256 => Request) internal _queue;

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
    if (templateId == 0) {
      revert TemplateZero();
    }

    (uint256 childId, uint256 matronId, uint256 sireId) = decodeData(templateId);

    _queue[getRandomNumber()] = Request(account, childId.toUint32(), matronId.toUint32(), sireId.toUint32());
  }

  function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal virtual {
    uint256 tokenId = _tokenIdTracker.current();
    _tokenIdTracker.increment();
    Request memory request = _queue[requestId];

    emit MintRandom(requestId, request.account, randomWords[0], request.templateId, tokenId);

    uint256 genes = encodeData(request, randomWords[0]);

    _upsertRecordField(tokenId, GENES, genes);
    _upsertRecordField(tokenId, TEMPLATE_ID, request.templateId);

    delete _queue[requestId];
    _safeMint(request.account, tokenId);
  }

  function decodeData(uint256 externalId) internal pure returns (uint256 childId, uint256 matronId, uint256 sireId) {
    childId = uint256(uint32(externalId));
    matronId = uint256(uint32(externalId >> 32));
    sireId = uint256(uint32(externalId >> 64));
  }

  function encodeData(Request memory req, uint256 randomness) internal pure returns (uint256 genes) {
    genes |= uint256(req.matronId);
    genes |= uint256(req.sireId) << 32;
    genes |= uint256(uint192(randomness)) << 64;
  }

  function getRandomNumber() internal virtual returns (uint256 requestId);
}
