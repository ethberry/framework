// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";

import "@gemunion/contracts/contracts/ERC721/preset/ERC721ACBER.sol";
import "@gemunion/contracts/contracts/ERC721/ERC721BaseUrl.sol";
import "@gemunion/contracts/contracts/utils/GeneralizedCollection.sol";

import "./interfaces/IERC721Simple.sol";

contract ERC721Simple is IERC721Simple, ERC721ACBER, ERC721BaseUrl {
  using Counters for Counters.Counter;

  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI,
    uint96 royalty
  ) ERC721ACBER(name, symbol, baseTokenURI, royalty) {
    // should start from 1
    _tokenIdTracker.increment();
  }

  function mintCommon(address to, uint256) public override onlyRole(MINTER_ROLE) returns (uint256 tokenId) {
    tokenId = _tokenIdTracker.current();
    safeMint(to);
  }

  function _baseURI() internal view virtual override(ERC721ACBER) returns (string memory) {
    return _baseURI(_baseTokenURI);
  }

  receive() external payable {
    revert();
  }
}
