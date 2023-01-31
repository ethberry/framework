// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "../ERC721MysteryboxSimple.sol";

contract ERC721MysteryboxTest is ERC721MysteryboxSimple {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721MysteryboxSimple(name, symbol, royalty, baseTokenURI) {}

  function mintCommon(address account, uint256 templateId) external virtual override onlyRole(MINTER_ROLE) {
    _mintCommon(account, templateId);
  }
}
