// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "../ERC721/interfaces/IERC721Upgradeable.sol";
import "../ERC721/interfaces/IERC721Random.sol";
import "../Mechanics/Mysterybox/interfaces/IERC721Mysterybox.sol";

contract InterfaceIdCalculator {
  constructor() {
    console.logBytes4(type(IERC721Upgradeable).interfaceId);
    console.logBytes4(type(IERC721Random).interfaceId);
    console.logBytes4(type(IERC721Mysterybox).interfaceId);

    console.logBytes32(keccak256("template_id"));
    console.logBytes32(keccak256("grade"));
    console.logBytes32(keccak256("rarity"));
  }
}
