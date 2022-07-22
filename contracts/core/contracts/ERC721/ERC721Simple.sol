// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

import "@gemunion/contracts/contracts/ERC721/preset/ERC721ACBER.sol";
import "@gemunion/contracts/contracts/ERC721/ERC721ACBaseUrl.sol";

import "./interfaces/IERC721Simple.sol";
import "../Mechanics/MetaData/MetaDataGetter.sol";

contract ERC721Simple is IERC721Simple, ERC721ACBER, ERC721ACBaseUrl, MetaDataGetter {
  using Counters for Counters.Counter;

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721ACBER(name, symbol, royalty) ERC721ACBaseUrl(baseTokenURI) {
    // should start from 1
    _tokenIdTracker.increment();
  }

  function mintCommon(address to, Asset calldata item) public virtual override onlyRole(MINTER_ROLE) {
    require(item.tokenId != 0, "ERC721Graded: wrong type");

    uint256 tokenId = _tokenIdTracker.current();
    _tokenIdTracker.increment();

    upsertRecordField(tokenId, TEMPLATE_ID, item.tokenId);

    _safeMint(to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(AccessControl, ERC721ACBER)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return _baseURI(_baseTokenURI);
  }

  receive() external payable {
    revert();
  }
}
