// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "../../../Exchange/lib/interfaces/IAsset.sol";

interface IERC721MysteryBox {
  function mintBox(address to, uint256 templateId, Asset[] memory items) external;
}
