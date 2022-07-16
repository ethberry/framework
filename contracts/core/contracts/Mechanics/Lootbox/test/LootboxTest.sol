// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "../Lootbox.sol";
import "../../Asset/interfaces/IAsset.sol";

contract LootboxTest is Lootbox {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) Lootbox(name, symbol, royalty, baseTokenURI) {}

  function mintCommon(address to, Asset calldata token) public onlyRole(MINTER_ROLE) {
    _safeMint(to, token.tokenId);
  }
}
