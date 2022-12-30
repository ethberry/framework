// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

// import "@gemunion/contracts-chain-link/contracts/extensions/ERC721ChainLinkBinance.sol";
// import "@gemunion/contracts-chain-link/contracts/extensions/ChainLinkGoerli.sol";

import "../ERC721Upgradeable.sol";
import "../interfaces/IERC721Random.sol";
import "../../Mechanics/Rarity/Rarity.sol";
import "../../MOCKS/ChainLink/ChainLinkGemunionTest.sol";

contract ERC721UpgradeableRandomGemunion is IERC721Random, ChainLinkGemunionTest, ERC721Upgradeable, Rarity {
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

  function mintCommon(address account, uint256 templateId) public override(ERC721Upgradeable) onlyRole(MINTER_ROLE) {
    uint256 tokenId = _mintCommon(account, templateId);

    _upsertRecordField(tokenId, GRADE, 1);
    _upsertRecordField(tokenId, RARITY, 1);
  }

  function mintRandom(address to, uint256 templateId) external override onlyRole(MINTER_ROLE) {
    require(templateId != 0, "ERC721Random: wrong type");
    _queue[getRandomNumber()] = Request(to, templateId);
  }

  function upgrade(uint256 tokenId) public override onlyRole(MINTER_ROLE) returns (bool) {
    uint256 grade = getRecordFieldValue(tokenId, GRADE);
    _upsertRecordField(tokenId, GRADE, grade + 1);
    emit LevelUp(_msgSender(), tokenId, grade + 1);
    return true;
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    uint256 tokenId = _tokenIdTracker.current();
    uint256 rarity = _getDispersion(randomness);
    Request memory request = _queue[requestId];

    _upsertRecordField(tokenId, TEMPLATE_ID, request.templateId);
    _upsertRecordField(tokenId, GRADE, 1);
    _upsertRecordField(tokenId, RARITY, rarity);

    delete _queue[requestId];
    safeMint(request.account);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return interfaceId == type(IERC721Random).interfaceId || super.supportsInterface(interfaceId);
  }
}
