// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "../ERC721Mysterybox.sol";

contract ERC721MysteryboxTest is ERC721Mysterybox {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721Mysterybox(name, symbol, royalty, baseTokenURI) {}

  function mintCommon(address to, uint256 templateId) external override onlyRole(MINTER_ROLE) {
    _safeMint(to, templateId);
  }
}
