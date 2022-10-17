// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

//import "@gemunion/contracts/contracts/ERC721/ChainLink/ERC721ChainLinkBinance.sol";

import "../ERC721/interfaces/IERC721Random.sol";
import "./ERC998Upgradeable.sol";
import "../Mechanics/Rarity/Rarity.sol";
import "../ERC721/test/ERC721ChainLinkGoerli.sol"; // TODO should import from @gemunion/contracts

contract ERC998UpgradeableRandom is IERC721Random, ERC721ChainLinkGoerli, ERC998Upgradeable, Rarity {
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
  ) ERC998Upgradeable(name, symbol, royalty, baseTokenURI) {}

  function mintCommon(address account, uint256 templateId) external override(ERC998Upgradeable) onlyRole(MINTER_ROLE) {
    require(templateId != 0, "ERC998: wrong type");

    uint256 tokenId = _tokenIdTracker.current();
    _tokenIdTracker.increment();

    upsertRecordField(tokenId, TEMPLATE_ID, templateId);
    upsertRecordField(tokenId, GRADE, 1);
    upsertRecordField(tokenId, RARITY, 1);

    _safeMint(account, tokenId);
  }

  function mintRandom(address account, uint256 templateId) external override onlyRole(MINTER_ROLE) {
    require(templateId != 0, "ERC998: wrong type");
    _queue[getRandomNumber()] = Request(account, templateId);
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    uint256 tokenId = _tokenIdTracker.current();
    uint256 rarity = _getDispersion(randomness);
    Request memory request = _queue[requestId];

    emit MintRandom(requestId, request.account, randomness, request.templateId, tokenId);

    upsertRecordField(tokenId, TEMPLATE_ID, request.templateId);
    upsertRecordField(tokenId, GRADE, 1);
    upsertRecordField(tokenId, RARITY, rarity);

    delete _queue[requestId];
    _safeMint(request.account, tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return interfaceId == type(IERC721Random).interfaceId || super.supportsInterface(interfaceId);
  }
}
