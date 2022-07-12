// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "../Airdrop.sol";

contract AirdropTest is Airdrop {
  constructor(
    string memory name,
    string memory symbol,
    uint256 cap,
    uint96 royalty,
    string memory baseTokenURI
  ) Airdrop(name, symbol, cap, royalty, baseTokenURI) {}

  function mintCommon(address to, uint256 tokenId) public onlyRole(MINTER_ROLE) returns (uint256) {
    _safeMint(to, tokenId);
    return tokenId;
  }
}
