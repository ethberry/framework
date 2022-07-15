// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

interface ILootbox {
  function mintLootbox(address to, uint256 templateId) external returns (uint256);
}
