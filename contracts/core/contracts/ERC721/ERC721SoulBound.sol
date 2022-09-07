// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./ERC721Simple.sol";

contract ERC721SoulBound is ERC721Simple {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721Simple(name, symbol, royalty, baseTokenURI) {}

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256
  ) internal pure override {
    require(from == address(0) || to == address(0), "ERC721SoulBound: can't be transferred");
  }
}
