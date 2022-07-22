// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

import "@gemunion/contracts/contracts/ERC721/ChainLink/ERC721ChainLinkBinance.sol";

import "../ERC721/ERC721Graded.sol";
import "../ERC721/interfaces/IERC721Random.sol";
import "../Mechanics/Asset/interfaces/IAsset.sol";

contract ERC998Random is IERC721Random, ERC721ChainLinkBinance, ERC721Graded {
  using Counters for Counters.Counter;

  struct Request {
    address account;
    Asset item;
  }

  mapping(bytes32 => Request) internal _queue;

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721Graded(name, symbol, royalty, baseTokenURI) {
  }

  function mintCommon(address to, Asset calldata item) public override(IERC721Simple, ERC721Graded) onlyRole(MINTER_ROLE) {
    require(item.tokenId != 0, "ERC721Random: wrong type");

    uint256 tokenId = _tokenIdTracker.current();
    _tokenIdTracker.increment();

    upsertRecordField(tokenId, TEMPLATE_ID, item.tokenId);
    upsertRecordField(tokenId, GRADE, 1);
    upsertRecordField(tokenId, RARITY, 1);

    _safeMint(to, tokenId);
  }

  function mintRandom(address to, Asset calldata item) external override onlyRole(MINTER_ROLE) {
    require(item.tokenId != 0, "ERC721Random: wrong type");
    _queue[getRandomNumber()] = Request(to, item);
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    uint256 tokenId = _tokenIdTracker.current();
    uint256 rarity = _getDispersion(randomness);
    Request memory request = _queue[requestId];

    upsertRecordField(tokenId, TEMPLATE_ID, request.item.tokenId);
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
