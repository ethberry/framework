// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+undeads@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";

import "@gemunion/contracts/contracts/ERC721/preset/ERC721ACBER.sol";
import "@gemunion/contracts/contracts/ERC721/ERC721BaseUrl.sol";
import "@gemunion/contracts/contracts/ERC721/ChainLink/ERC721ChainLinkBinance.sol";

import "../Marketplace/interfaces/IEIP712ERC721.sol";

contract Item is ERC721ChainLinkBinance, ERC721ACBER, ERC721BaseUrl, IEIP712ERC721 {
  using Counters for Counters.Counter;

  struct Request {
    address owner;
    uint256 templateId;
    uint256 dropboxId;
  }

  event MintRandom(address to, uint256 tokenId, uint256 templateId, uint256 rarity, uint256 dropboxId);

  // requestId => Request
  mapping(bytes32 => Request) internal _queue;

  // tokenId => Item
  mapping(uint256 => Data) internal _items;

  uint256 private _maxTemplateId = 0;

  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI,
    uint96 royaltyNumerator
  ) ERC721ACBER(name, symbol, baseTokenURI, royaltyNumerator) {
    _tokenIdTracker.increment();
    // should start from 1
  }

  function mintRandom(
    address to,
    uint256 templateId,
    uint256 dropboxId
  ) external override onlyRole(MINTER_ROLE) {
    require(templateId != 0, "Item: wrong type");
    require(templateId <= _maxTemplateId, "Item: wrong type");
    _queue[getRandomNumber()] = Request(to, templateId, dropboxId);
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    uint256 tokenId = _tokenIdTracker.current();
    uint256 rarity = _getDispersion(randomness);
    Request memory dataR = _queue[requestId];

    _items[tokenId] = Data(dataR.templateId, rarity);

    emit MintRandom(dataR.owner, tokenId, dataR.templateId, rarity, dataR.dropboxId);

    delete _queue[requestId];
    safeMint(dataR.owner);
  }

  function mintCommon(address to, uint256 templateId) public override onlyRole(MINTER_ROLE) returns (uint256 tokenId) {
    require(templateId != 0, "Item: wrong type");
    require(templateId <= _maxTemplateId, "Item: wrong type");
    tokenId = _tokenIdTracker.current();
    _items[tokenId] = Data(templateId, 1);
    safeMint(to);
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

  function getDataByTokenId(uint256 tokenId) public view override returns (Data memory) {
    require(_exists(tokenId), "Item: token does not exist");
    return _items[tokenId];
  }

  function setMaxTemplateId(uint256 maxTemplateId) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _maxTemplateId = maxTemplateId;
  }

  function _baseURI() internal view virtual override(ERC721ACBER) returns (string memory) {
    return _baseURI(_baseTokenURI);
  }

  receive() external payable {
    revert();
  }
}
