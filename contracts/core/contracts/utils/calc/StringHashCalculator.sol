// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "hardhat/console.sol";

contract StringHashCalculator {
  function test() public view {
    console.logBytes32(keccak256("TEMPLATE_ID"));
    console.logBytes32(keccak256("GRADE"));
    console.logBytes32(keccak256("RARITY"));
    console.logBytes32(keccak256("GENES"));
  }
}
