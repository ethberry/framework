// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "../ERC721/interfaces/IERC721Random.sol";
import "../Mechanics/Lootbox/interfaces/ILootbox.sol";

contract InterfaceIdCalculator {
  constructor() {
    console.logBytes4(type(IERC721Random).interfaceId);
    console.logBytes4(type(ILootbox).interfaceId);
  }
}
