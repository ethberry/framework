// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "../Dropbox.sol";

contract DropboxTest is Dropbox {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) Dropbox(name, symbol, royalty, baseTokenURI) {}

  function mintCommon(address to, uint256 tokenId) public onlyRole(MINTER_ROLE) returns (uint256) {
    _safeMint(to, tokenId);
    return tokenId;
  }
}
