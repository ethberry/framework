// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "../../Asset/interfaces/IAsset.sol";

interface ILootbox {
  function mintLootbox(address to, Asset calldata item) external;
}
