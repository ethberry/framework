// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity >=0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";

import "@gemunion/contracts/contracts/ERC721/preset/ERC721ACBER.sol";
import "@gemunion/contracts/contracts/ERC721/ERC721BaseUrl.sol";
import "@gemunion/contracts/contracts/utils/GeneralizedCollection.sol";

import "../interfaces/IERC721Random.sol";
import "../../MOCKS/ChainLink/ERC721ChainLinkHH.sol";

contract ERC721RandomTest is IERC721Random, ERC721ChainLinkHH, ERC721ACBER, ERC721BaseUrl, GeneralizedCollection {
  using Counters for Counters.Counter;

  struct Request {
    address owner;
    uint256 templateId;
    uint256 dropboxId;
  }

  event MintRandom(address to, uint256 tokenId, uint256 templateId, uint256 rarity, uint256 dropboxId);

  mapping(bytes32 => Request) internal _queue;

  bytes32 public constant TEMPLATE_ID = keccak256("templateId");
  bytes32 public constant RARITY = keccak256("rarity");

  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI,
    uint96 royalty
  ) ERC721ACBER(name, symbol, baseTokenURI, royalty) {
    // should start from 1
    _tokenIdTracker.increment();
  }

  function mintCommon(address to, uint256 templateId) public override onlyRole(MINTER_ROLE) returns (uint256 tokenId) {
    require(templateId != 0, "ERC721Random: wrong type");
    tokenId = _tokenIdTracker.current();

    upsertRecordField(tokenId, TEMPLATE_ID, templateId);
    upsertRecordField(tokenId, RARITY, 1);

    safeMint(to);
  }

  function mintRandom(
    address to,
    uint256 templateId,
    uint256 dropboxId
  ) external override onlyRole(MINTER_ROLE) {
    require(templateId != 0, "ERC721Random: wrong type");
    _queue[getRandomNumber()] = Request(to, templateId, dropboxId);
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    uint256 tokenId = _tokenIdTracker.current();
    uint256 rarity = _getDispersion(randomness);
    Request memory request = _queue[requestId];

    upsertRecordField(tokenId, TEMPLATE_ID, request.templateId);
    upsertRecordField(tokenId, RARITY, rarity);

    emit MintRandom(request.owner, tokenId, request.templateId, rarity, request.dropboxId);

    delete _queue[requestId];
    safeMint(request.owner);
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

  function _baseURI() internal view virtual override(ERC721ACBER) returns (string memory) {
    return _baseURI(_baseTokenURI);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return
    interfaceId == type(IERC721Random).interfaceId ||
    super.supportsInterface(interfaceId);
  }

  receive() external payable {
    revert();
  }
}
