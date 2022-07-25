// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "../ERC721Lootbox.sol";

contract ERC721LootboxTest is ERC721Lootbox {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721Lootbox(name, symbol, royalty, baseTokenURI) {}

  function mintCommon(address to, uint256 templateId) public override onlyRole(MINTER_ROLE) {
    _safeMint(to, templateId);
  }
}
