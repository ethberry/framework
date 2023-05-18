// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";

import "../utils/constants.sol";
import "./ERC998Simple.sol";
import "../ERC721/interfaces/IERC721Random.sol";
import "../Mechanics/Breed/Breed.sol";

abstract contract ERC998Genes is IERC721Random, ERC998Simple, Breed {
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
  ) ERC998Simple(name, symbol, royalty, baseTokenURI) {}

  function mintCommon(address, uint256) external virtual override onlyRole(MINTER_ROLE) {
    revert MethodNotSupported();
  }

  function mintRandom(address account, uint256 templateId) external override onlyRole(MINTER_ROLE) {
    if (templateId == 0) {
      revert TemplateZero();
    }

    _queue[getRandomNumber()] = Request(account, templateId);
  }

  function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal virtual {
    uint256 tokenId = _tokenIdTracker.current();
    _tokenIdTracker.increment();
    Request memory request = _queue[requestId];

    emit MintRandom(requestId, request.account, randomWords[0], request.templateId, tokenId);

    _upsertRecordField(tokenId, TEMPLATE_ID, request.templateId);
    _upsertRecordField(tokenId, GENES, randomWords[0]);

    delete _queue[requestId];
    _safeMint(request.account, tokenId);
  }

  function getRandomNumber() internal virtual returns (uint256 requestId);

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return interfaceId == type(IERC721Random).interfaceId || super.supportsInterface(interfaceId);
  }
}
