// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "../../Asset/interfaces/IAsset.sol";

interface IERC721Lootbox {
  function mintLootbox(address to, Asset calldata item) external;
}
