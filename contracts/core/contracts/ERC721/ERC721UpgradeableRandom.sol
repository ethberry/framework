// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

import "@gemunion/contracts/contracts/ERC721/ChainLink/ERC721ChainLinkBinance.sol";

import "./ERC721Upgradeable.sol";
import "./interfaces/IERC721Random.sol";

contract ERC721UpgradeableRandom is IERC721Random, ERC721ChainLinkBinance, ERC721Upgradeable {
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

  function mintCommon(address to, uint256 templateId)
    public
    override(ERC721Upgradeable)
    onlyRole(MINTER_ROLE)
  {
    require(templateId != 0, "ERC721Random: wrong type");

    uint256 tokenId = _tokenIdTracker.current();
    _tokenIdTracker.increment();

    upsertRecordField(tokenId, TEMPLATE_ID, templateId);
    upsertRecordField(tokenId, GRADE, 1);
    upsertRecordField(tokenId, RARITY, 1);

    _safeMint(to, tokenId);
  }

  function mintRandom(address to, uint256 templateId) external override onlyRole(MINTER_ROLE) {
    require(templateId != 0, "ERC721Random: wrong type");
    _queue[getRandomNumber()] = Request(to, templateId);
  }

  function upgrade(uint256 tokenId) public onlyRole(MINTER_ROLE) override returns (bool) {
    uint256 grade = getRecordFieldValue(tokenId, GRADE);
    upsertRecordField(tokenId, GRADE, grade + 1);
    emit LevelUp(_msgSender(), tokenId, grade + 1);
    return true;
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    uint256 tokenId = _tokenIdTracker.current();
    uint256 rarity = _getDispersion(randomness);
    Request memory request = _queue[requestId];

    upsertRecordField(tokenId, TEMPLATE_ID, request.templateId);
    upsertRecordField(tokenId, GRADE, 1);
    upsertRecordField(tokenId, RARITY, rarity);

    delete _queue[requestId];
    safeMint(request.account);
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
