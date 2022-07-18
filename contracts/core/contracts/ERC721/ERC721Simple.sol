// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

import "@gemunion/contracts/contracts/ERC721/preset/ERC721ACBER.sol";
import "@gemunion/contracts/contracts/ERC721/ERC721BaseUrl.sol";
import "@gemunion/contracts/contracts/utils/GeneralizedCollection.sol";

import "./interfaces/IERC721Simple.sol";
import "../Mechanics/MetaData/MetaDataGetter.sol";

contract ERC721Simple is IERC721Simple, ERC721ACBER, ERC721BaseUrl, GeneralizedCollection, MetaDataGetter {
  using Counters for Counters.Counter;

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721ACBER(name, symbol, royalty) ERC721BaseUrl(baseTokenURI) {
    // should start from 1
    _tokenIdTracker.increment();
  }

  function mintCommon(address to, Asset calldata item) public override onlyRole(MINTER_ROLE) {
    require(item.tokenId != 0, "ERC721Graded: wrong type");

    uint256 tokenId = _tokenIdTracker.current();
    _tokenIdTracker.increment();

    upsertRecordField(tokenId, TEMPLATE_ID, item.tokenId);

    _safeMint(to, tokenId);
  }

  function setBaseURI(string memory baseTokenURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
    _setBaseURI(baseTokenURI);
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return _baseURI(_baseTokenURI);
  }

  receive() external payable {
    revert();
  }
}
