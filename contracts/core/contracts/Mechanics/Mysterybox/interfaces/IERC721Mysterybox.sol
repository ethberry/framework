// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "../../Exchange/interfaces/IAsset.sol";

interface IERC721Mysterybox {
  function mintBox(
    address to,
    uint256 templateId,
    Asset[] memory items
  ) external;
}
